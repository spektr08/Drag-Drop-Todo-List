"use client";

import { FormEvent, Fragment, useRef } from 'react'
import { Dialog, DialogProps, Transition } from '@headlessui/react'
import { useModalStore } from '@/store/ModalStore';
import { useBoardStore } from '@/store/BoardStore';
import TaskTypeRadioGroup from './TaskTypeRadioGroup';
import Image from 'next/image';
import { PhoneIcon, PhotoIcon } from '@heroicons/react/24/solid';

function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [newTaskInput, setNewTaskInput, newTaskType, image, setImage, addTask] = useBoardStore((state) => [
    state.newTaskInput,
    state.setNewTaskInput,
    state.newTaskType,
    state.image,
    state.setImage,
    state.addTask
  ])
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal
  ])
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!newTaskInput) return;

    addTask(newTaskInput, newTaskType, image)
    closeModal();
    setImage(null);
  }
  return (
    // Use the `Transition` component at the root level
    <Transition show={isOpen} as={Fragment}>
      <Dialog 
      as="form"
      onSubmit={handleSubmit}
      onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a task
                </Dialog.Title>
                <div className='mt-2'>
                  <input 
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a task here ..."
                    className="w-full border border-grey-300 rounded-md outline-none p-5"
                  />

                  <TaskTypeRadioGroup/>
                  <div className='mt-2'>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        imagePickerRef.current?.click();            
                      }}
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 
                    focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                      <PhotoIcon 
                          className="h-6 w-6 mr-2 inline-block"
                      />
                      Upload Image
                    </button>
                    {image && (
                      <Image
                        src={URL.createObjectURL(image)}
                        width={200}
                        height={200}
                        className="w-full h-44 object-cover mt-12 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                        alt="Uploaded Image"
                        onClick={() => {
                          imagePickerRef.current.value = null;
                          setImage(null);
                        }}
                      />
                    )}
                    <input
                      type="file"
                      ref={imagePickerRef}
                      hidden
                      onChange={(e) => {
                        if(!e.target.files![0].type.startsWith('image/')) return;
                        setImage(e.target.files![0]);
                      }}
                    />
                  </div>
                <div className="mt-4">
                      <button
                        type="submit"
                        disabled={!newTaskInput}
                        className="inline-flex justify-center rounded-md border border-trasnparent bg-blue-100 px-4 py-2
                        text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus:visible:ring-2
                        focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                        disabled:cursor-not-allowed"
                      >
                        Add Task
                      </button>
                </div>

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal;