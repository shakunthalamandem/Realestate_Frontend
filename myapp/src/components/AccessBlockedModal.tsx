import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

type AccessBlockedModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToLogin: () => void;
};

const AccessBlockedModal = ({
  open,
  onOpenChange,
  onGoToLogin,
}: AccessBlockedModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[580px] rounded-[28px] border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
        <div className="rounded-[28px] bg-gradient-to-r from-[#101b56] via-[#2f35ac] to-[#2a9bcc] px-10 py-12 text-center text-white shadow-2xl">
          <DialogTitle className="text-5xl font-bold tracking-tight text-white sm:text-4xl">
            Session Ended
          </DialogTitle>
          <DialogDescription className="mx-auto mt-5 max-w-[460px] text-xl leading-relaxed text-white/90 sm:text-2xl">
            Your session has timed out for security reasons. Please log in again to continue.
          </DialogDescription>
          <Button
            type="button"
            className="mt-8 h-14 rounded-full bg-[#ff7f2a] px-10 text-lg font-semibold text-white hover:bg-[#f17422]"
            onClick={onGoToLogin}
          >
            Go to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessBlockedModal;
