import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface SubmitDialogProps {
  children: React.ReactNode;
  items: any[];
  currentScenario: {
    title: string;
    instruction: string;
  };
}

interface SubmissionResponse {
  score: string;
  feedback: string;
}

export function SubmitDialog({ children, items, currentScenario }: SubmitDialogProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<SubmissionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatConversation = (items: any[]): string => {
    return items
      .filter(item => item.content?.text || item.formatted?.text) // Filter out empty messages
      .map(item => {
        const role = item.role === 'assistant' ? 'AI' : 'User';
        // Try different possible locations for the text content
        const content = item.content?.text || item.formatted?.text || item.content || '';
        return `${role}: ${content}`;
      })
      .join('\n');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const conversation = formatConversation(items);
      console.log('Formatted conversation:', conversation);
      
      const payload = {
        email,
        conversation,
        scenario: currentScenario.title,
        scenarioInstructions: currentScenario.instruction
      };

      const response = await fetch('https://7os5kk.buildship.run/roleplaySubmission-90ae71898f74', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response data:', data);

      // Simple check for required fields
      if (!data || !data.score || !data.feedback) {
        throw new Error('Invalid response from server');
      }

      setResponse({
        score: data.score,
        feedback: data.feedback
      });
      setError(null);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting');
      setResponse(null);
    } finally {
      setIsSubmitting(false);
    }
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
          {!response ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-200 rounded"
                disabled={isSubmitting}
              />
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={!email || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium mb-2">Score: {response.score}/100</div>
                <div className="text-sm whitespace-pre-wrap">{response.feedback}</div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setResponse(null);
                  setError(null);
                }}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 