'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'sm' }: ModalProps) {
  if (!isOpen) return null;

  const maxWidth = size === 'lg' ? 'max-w-2xl' : 'max-w-md';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-4 overflow-x-hidden">
        <div
          className={`bg-white rounded-xl shadow-lg w-full ${maxWidth} relative my-4 sm:my-8 overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}