'use client';

import {
  useState,
  useEffect,
  useContext,
  useActionState
} from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { TeamContext } from '@/context/team';
import { fromInput } from '@/actions/decode';

export default function ImportBuildDialog({
  children,
}: {
  children: React.ReactNode,
}) {
  const [formState, formAction, isPending] = useActionState(fromInput, null);
  const { team, newPlayer } = useContext(TeamContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (formState?.data && formState?.success) {
      const player = formState.data;
      const nextId = team.length ? Math.max(...team.map(x => x.id)) + 1 : 1;
      newPlayer(
        nextId,
        player.first as string,
        player.second as string,
        player.build,
        player.template,
        (player.attributes as Record<string, number>) ?? {},
      );
      setOpen(false);
    }
  }, [formState]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import a Build</DialogTitle>
          <DialogDescription/>
        </DialogHeader>

        <form
          action={formAction}
          className="mt-2 mx-auto space-y-2"
        >
          {!formState?.success && (
            <p className="text-red-500">
              {formState?.message}
            </p>
          )}
          <span>Enter a Template Code:</span>
          <Input
            placeholder="OgCjkirMrSmXfb5iaXNXAAAAAAA"
            id="code"
            name="code"
            type="text"
          />

          <Button
            className="w-full"
            isLoading={isPending}
          >
            Import
          </Button>
        </form>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="ghost">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}