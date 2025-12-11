'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard } from 'lucide-react';

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Check for Ctrl/Cmd key combinations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault();
            // Open global search (can implement later)
            break;
          case '/':
            e.preventDefault();
            setShowHelp(true);
            break;
        }
        return;
      }

      // Single key shortcuts
      switch (e.key.toLowerCase()) {
        case 'g':
          e.preventDefault();
          // Wait for second key
          const secondKeyHandler = (e2: KeyboardEvent) => {
            e2.preventDefault();
            switch (e2.key.toLowerCase()) {
              case 'd':
                router.push('/dashboard');
                break;
              case 'b':
                router.push('/bookings');
                break;
              case 'c':
                router.push('/calendar');
                break;
              case 'e':
                router.push('/expenses');
                break;
              case 'r':
                router.push('/reports');
                break;
              case 'h':
                router.push('/halls');
                break;
              case 'u':
                router.push('/users');
                break;
            }
            document.removeEventListener('keydown', secondKeyHandler);
          };
          document.addEventListener('keydown', secondKeyHandler);
          // Remove listener after 2 seconds
          setTimeout(() => {
            document.removeEventListener('keydown', secondKeyHandler);
          }, 2000);
          break;
        case 'n':
          e.preventDefault();
          // Quick new booking
          router.push('/bookings/new');
          break;
        case '?':
          e.preventDefault();
          setShowHelp(true);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  return (
    <>
      {/* Floating Help Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 hidden lg:flex"
        onClick={() => setShowHelp(true)}
        title="Keyboard shortcuts (Press ?)"
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Navigation Shortcuts */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                Navigation (Press g then)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <ShortcutItem keys={['g', 'd']} description="Go to Dashboard" />
                <ShortcutItem keys={['g', 'b']} description="Go to Bookings" />
                <ShortcutItem keys={['g', 'c']} description="Go to Calendar" />
                <ShortcutItem keys={['g', 'e']} description="Go to Expenses" />
                <ShortcutItem keys={['g', 'r']} description="Go to Reports" />
                <ShortcutItem keys={['g', 'h']} description="Go to Halls" />
                <ShortcutItem keys={['g', 'u']} description="Go to Users" />
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <ShortcutItem keys={['n']} description="New Booking" />
                <ShortcutItem keys={['?']} description="Show this help" />
              </div>
            </div>

            {/* System Shortcuts */}
            <div>
              <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                System
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <ShortcutItem keys={['Ctrl', '/']} description="Show keyboard shortcuts" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <span className="text-sm">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className="px-2 py-1 text-xs font-semibold bg-gray-100 border border-gray-300 rounded"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}
