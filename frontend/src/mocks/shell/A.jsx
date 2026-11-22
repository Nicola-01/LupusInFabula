import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { session } from '@/mocks/fixtures';
import { Layout, Navbar, ThemeToggle, MessageBox, Panel, PageTitle, Section, BTN_PRIMARY, BTN_GHOST, BTN_DANGER, POPUP } from '@/mocks/shell/kit/A.jsx';
import { cn } from '@/lib/utils';

/** Small caption above each specimen. */
function Specimen({ label, children, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#387B99] dark:text-[#4BA3C3]">{label}</p>
      {children}
    </div>
  );
}

function DemoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(BTN_PRIMARY, 'h-10 px-4')}>Open dialog</Button>
      </DialogTrigger>
      <DialogContent className={cn('rounded-xl sm:max-w-md', POPUP)}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Leave this village?</DialogTitle>
          <DialogDescription className="text-[#0c0d10]/75 dark:text-[#EAF0F2]/75">
            You will lose your seat and the game log will keep your name.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="ghost" className={BTN_GHOST}>Cancel</Button>
          <Button className={BTN_DANGER}>Leave</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MockShellA() {
  const username = session.user.username;

  return (
    <Layout user={username}>
        <PageTitle>Shell preview</PageTitle>

        <Specimen label="Navbar, logged in (user menu open)" className="pb-40">
          <Navbar user={username} defaultMenuOpen />
        </Specimen>

        <Specimen label="Navbar, logged out">
          <Navbar user={null} />
        </Specimen>

        <Specimen label="Navbar, player search results open" className="pb-40">
          <Navbar user={username} defaultSearchOpen />
        </Specimen>

        <Section title="Messages">
          <div className="space-y-3">
            <MessageBox kind="error" code="EGME9" title="Invalid game" details="The game you are looking for does not exist or has ended." />
            <MessageBox kind="info" title="Waiting for players" details="The village needs at least 6 players to start." />
            <MessageBox kind="warning" title="Night phase" details="Two villagers have not voted yet." />
            <MessageBox kind="success" title="Village created" details="Share the public id with your players." />
          </div>
        </Section>

        <Section title="Dialog">
          <div className="flex flex-wrap items-start gap-6">
            <Specimen label="Interactive (button opens it)">
              <DemoDialog />
            </Specimen>
            <Specimen label="Static example">
              <div className={cn('w-full max-w-md rounded-xl border p-6 shadow-md', POPUP)}>
                <h3 className="text-xl font-semibold">Leave this village?</h3>
                <p className="mt-2 text-sm text-[#0c0d10]/75 dark:text-[#EAF0F2]/75">
                  You will lose your seat and the game log will keep your name.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="ghost" className={BTN_GHOST}>Cancel</Button>
                  <Button className={BTN_DANGER}>Leave</Button>
                </div>
              </div>
            </Specimen>
          </div>
        </Section>

        <Section title="Toast (sonner)">
          <div className="flex flex-wrap items-center gap-3">
            <Button className={cn(BTN_PRIMARY, 'h-10 px-4')} onClick={() => toast.success('Settings saved', { description: 'Your settings were updated.' })}>
              Show toast
            </Button>
            <Toaster position="bottom-right" />
          </div>
        </Section>

        <Section title="Theme toggle">
          <div className="flex items-center gap-3 rounded-lg bg-[#4BA3C3] dark:bg-[#0D324D] p-2 w-fit text-white">
            <ThemeToggle />
            <span className="text-sm">Switches light and dark</span>
          </div>
        </Section>

        <Panel>
          <p className="text-sm text-[#0c0d10]/75 dark:text-[#EAF0F2]/75">
            Footer: rendered at the bottom of this page by the Layout.
          </p>
        </Panel>
    </Layout>
  );
}
