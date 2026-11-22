import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { session } from '@/mocks/fixtures';
import {
  Footer,
  Frame,
  MessageBox,
  Navbar,
  Panel,
  PageTitle,
  SearchBox,
  ThemeToggle,
  ghostButtonClass,
  glowButtonClass,
} from './kit/D.jsx';

function Section({ label, children }) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#d9692b] dark:text-[#ffb347]">{label}</p>
      {children}
    </section>
  );
}

export default function MockShellD() {
  const username = session.user.username;
  return (
    <Frame>
      <Toaster />
      <Navbar user={username} userMenuOpen />
      <div className="mx-auto w-full max-w-5xl flex-1 space-y-12 px-4 py-8">
        <PageTitle kicker="Shell · variant D">Common chrome</PageTitle>

        <Section label="Navbar, logged out">
          <Navbar user={null} />
        </Section>

        <Section label="Search results open">
          <div className="max-w-sm">
            <SearchBox defaultOpen />
          </div>
        </Section>

        <Section label="Message popups">
          <div className="grid gap-4 md:grid-cols-2">
            <MessageBox kind="error" title="Invalid game" details="The game code does not match any active village." code="EGME9" />
            <MessageBox kind="info" title="Village updated" details="Your changes are visible to every habitant." />
            <MessageBox kind="warning" title="Night is almost over" details="Two roles have not acted yet." />
            <MessageBox kind="success" title="Friend added" details="You and Matteo are now friends." />
          </div>
        </Section>

        <Section label="Modal dialog (button opens it, right: static preview)">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" className={glowButtonClass}>Open dialog</button>
              </DialogTrigger>
              <DialogContent className="border-[#c98a4b]/30 bg-white/90 text-[#2a1e2e] backdrop-blur-md dark:border-white/10 dark:bg-[#141a33]/95 dark:text-[#e8e6f0] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="f-title text-2xl">Leave the village?</DialogTitle>
                  <DialogDescription className="text-current opacity-80">
                    You will stop receiving night actions for this game.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <button type="button" className={ghostButtonClass}>Cancel</button>
                  <button type="button" className={glowButtonClass}>Confirm</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Panel className="space-y-4 p-6 shadow-[0_10px_30px_rgba(0,0,0,.35)]">
              <div className="space-y-1">
                <h2 className="f-title text-2xl font-bold">Leave the village?</h2>
                <p className="text-sm opacity-80">You will stop receiving night actions for this game.</p>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className={ghostButtonClass}>Cancel</button>
                <button type="button" className={glowButtonClass}>Confirm</button>
              </div>
            </Panel>
          </div>
        </Section>

        <Section label="Toast (sonner)">
          <button
            type="button"
            className={glowButtonClass}
            onClick={() => toast.success('Friend request sent', { description: 'Matteo will see it on his next visit.' })}
          >
            Show toast
          </button>
        </Section>

        <Section label="Theme toggle">
          <div className="flex items-center gap-3 text-sm">
            <ThemeToggle /> <span>Switches light (golden dawn) and dark (night sky).</span>
          </div>
        </Section>

        <Section label="Footer">
          <Footer />
        </Section>
      </div>
    </Frame>
  );
}
