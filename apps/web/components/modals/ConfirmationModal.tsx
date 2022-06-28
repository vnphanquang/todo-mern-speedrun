import React from 'react';
import { ModalComponentProps } from 'react-hooks-async-modal';

export interface ConfirmationModalProps {
  message: string
}

export const ConfirmationModal: React.FC<ConfirmationModalProps & ModalComponentProps<boolean>> = ({
  message,
  onResolve,
}) => {
  const backRef = React.useRef(null)

  return (
    <div
      className='modal modal-open'
      ref={backRef}
      onClick={e =>
        // prevent triggering if clicked on a child
        (e.target === backRef.current) &&
          onResolve(false)}
    >
      <div className='modal-box p-10 flex flex-col gap-y-10'>
        <h2 className="text-2xl font-bold">Confirmation</h2>
        <p className="">{message}</p>
        <div className="w-full grid grid-cols-2 gap-x-10">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => onResolve(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onResolve(true)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
