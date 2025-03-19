import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommandBus } from '@nestjs/cqrs';
import { QuizGameQueryRepository } from '../../infrastructure/quiz-game.query.repository';
import { GameSocketEvents } from './enums/socket-events';
import { UseGuards } from '@nestjs/common';
import { SocketIoAuthMiddleware } from '../../../../infrastructure/middleware/ws-user-auth.middleware';
import { UserWsAuthGuard } from '../../../../infrastructure/guards/user-ws-auth.guard';
import { AnswerNextQuizQuestionCommand } from '../../application/use-cases/answer-next-quiz-question.handler';

@WebSocketGateway({ cors: true, namespace: 'quiz-game' })
@UseGuards(UserWsAuthGuard)
export class QuizGameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizGameQueryRepository: QuizGameQueryRepository,
  ) {}

  afterInit(client: Socket) {
    client.use(SocketIoAuthMiddleware() as any);
  }

  async handleConnection(client: Socket) {
    const currentGame = await this.quizGameQueryRepository.getCurrentUserGame(
      client.data.user.userId,
    );

    client.emit(GameSocketEvents.GetCurrentGameDetails, currentGame);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(GameSocketEvents.AnswerTheQuestion)
  async answerTheQuestion(client: Socket, answer: string) {
    const answerOnNextGameQuestionCommand = new AnswerNextQuizQuestionCommand({
      userId: client.data.user.userId,
      answer: answer,
    });

    const answerId = await this.commandBus.execute(
      answerOnNextGameQuestionCommand,
    );

    const updatedGame =
      this.quizGameQueryRepository.findGameAnswerById(answerId);

    this.server.emit(GameSocketEvents.GetCurrentGameDetails, updatedGame);
  }
}
