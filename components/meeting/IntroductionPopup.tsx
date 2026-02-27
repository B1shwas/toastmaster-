"use client";

import { User } from "lucide-react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContent,
} from "@/components/ui/modal-components";

interface IntroductionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  introduction: string | null | undefined;
}

export function IntroductionPopup({
  isOpen,
  onClose,
  memberName,
  introduction,
}: IntroductionPopupProps) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="md">
      <ModalHeader
        title={memberName}
        description="Member Introduction"
        onClose={onClose}
      />
      <ModalContent>
        <div className="flex items-start gap-4 py-2">
          <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-slate-300 leading-relaxed">
            {introduction?.trim()
              ? introduction
              : "This member has not added an introduction yet."}
          </p>
        </div>
      </ModalContent>
    </ModalWrapper>
  );
}
