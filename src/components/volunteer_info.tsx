import React from "react";

interface VolunteerInfoProps {
  volunteerInfo: {
    id: string;
    kh_name: string;
    kh_team: string;
    name: string;
    team: string;
  };
  onBorrow: () => void;
  onReturn: () => void;
}

const VolunteerInfo: React.FC<VolunteerInfoProps> = ({
  volunteerInfo,
  onBorrow,
  onReturn,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Volunteer Information</h2>
      <div className="grid grid-cols-2 gap-4 mb-6 text-lg">
        <div>
          <p className="font-semibold">ID:</p>
          <p>{volunteerInfo.id}</p>
        </div>
        <div>
          <p className="font-semibold">Khmer Name:</p>
          <p>{volunteerInfo.kh_name}</p>
        </div>
        <div>
          <p className="font-semibold">Khmer Team:</p>
          <p>{volunteerInfo.kh_team}</p>
        </div>
        <div>
          <p className="font-semibold">Name:</p>
          <p>{volunteerInfo.name}</p>
        </div>
        <div>
          <p className="font-semibold">Team:</p>
          <p>{volunteerInfo.team}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onBorrow}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Borrow
        </button>
        <button
          onClick={onReturn}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default VolunteerInfo;
