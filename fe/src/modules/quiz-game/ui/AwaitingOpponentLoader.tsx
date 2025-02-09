import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const AwaitingOpponentLoader = () => {
  return (
    <div className="m-auto h-full flex flex-col items-center justify-center flex-grow">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
        <h2 className="text-xl font-bold mb-4">Waiting for Opponent</h2>
        <div className="flex items-center justify-center gap-4">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-2xl text-blue-500"
          />
          <p className="text-lg">
            Please, wait while we are finding an opponent ...
          </p>
        </div>
      </div>
    </div>
  );
};
