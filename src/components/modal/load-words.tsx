import { Dispatch, SetStateAction, useRef, useState } from "react";
import BaseModel from "./base-modal";
import { api } from "~/utils/api";

interface CreateCollectionModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  open,
  setOpen,
}) => {
  const cancelButtonRef = useRef(null);
  const [words, setWords] = useState("");

  const handleWordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWords(e.target.value);
  };

  const loadWordsMutation = api.word.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const handleSubmit = () => {
    const result = loadWordsMutation.mutate({
      text: words,
    });
  };

  return (
    <BaseModel open={open} setOpen={setOpen} title="Load Words">
      <div className="mx-5">
        <label
          htmlFor="about"
          className="block text-sm font-medium text-white sm:mt-px sm:pt-2"
        >
          Words
        </label>
        <div className="mt-2 sm:col-span-2 sm:mt-0">
          <textarea
            id="about"
            name="about"
            rows={3}
            className="block w-full max-w-lg rounded-md border-gray-800 bg-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={words}
            onChange={handleWordsChange}
          />
        </div>
      </div>
      <div className="bg-[hsl(240,18%,14%)] px-4 py-3 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={handleSubmit}
          ref={cancelButtonRef}
        >
          Create
        </button>
      </div>
    </BaseModel>
  );
};

export default CreateCollectionModal;
