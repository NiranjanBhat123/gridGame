import React from 'react';

const ConfirmationDialog = ({ onConfirm, onCancel, message }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <p className="text-xl mb-4">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;