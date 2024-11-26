import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface SubmitDialogProps {
  children: React.ReactNode;
}

export function SubmitDialog({ children }: SubmitDialogProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    // TODO: Implement submission logic
    console.log('Submitting conversation for:', email);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Conversation</DialogTitle>
          <DialogDescription>
            Enter your email to submit this conversation for review.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-200 rounded"
          />
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={!email}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 