import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { session } from '@/mocks/fixtures';
import {
  Footer, MessageBox, Navbar, notify, PageTitle, Panel, SearchResults, Stage, ThemeToggle, Toaster, dangerBtn, outlineBtn, primaryBtn,
} from './kit/F.jsx';

// Demo only: each state is shown stacked with a label. Sections get bottom margin so open menus don't cover the next label.
function Section({ label, children, className = '' }) {
  return (
    <section className={cn('space-y-3', className)}>
      <p className="vf-title vf-rubric text-xs tracking-widest uppercase">{label}</p>
      {children}
    </section>
  );
}

export default function MockShellF() {
  const username = session.user.username;
  // Demo only: one toast on mount so the screenshot shows the toast style next to the popups.
  useEffect(() => { notify('success', 'The scroll has been sealed', 'Saved to the village register.', 'demo-mount'); }, []);

  return (
    <Stage>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <PageTitle sub="Wood, felt and wax">Shell · variant F</PageTitle>

        <div className="mt-10 space-y-16">
          <Section label="1. Navbar, logged in (user menu open)" className="pb-40">
            <div className="-mx-4 sm:-mx-0">
              <Navbar user={username} menuDefaultOpen />
            </div>
          </Section>

          <Section label="2. Navbar, logged out" className="pb-4">
            <div className="-mx-4 sm:-mx-0">
              <Navbar user={null} />
            </div>
          </Section>

          <Section label="3. Player search, results open">
            <div className="max-w-sm space-y-2">
              <input
                type="search"
                readOnly
                value="smo"
                aria-label="Search player (demo)"
                className="vf-input h-10 w-full pr-3 pl-3 text-base md:text-sm"
              />
              <SearchResults query="smo" />
            </div>
          </Section>

          <Section label="4. Popups: error, info, warning, success">
            <div className="grid gap-6 sm:grid-cols-2">
              <MessageBox kind="error" title="Invalid game" details="The game you asked for does not exist or has ended." />
              <MessageBox kind="info" title="Village created" details="Share the code with your players so they can join." />
              <MessageBox kind="warning" title="Night is ending" details="Two players have not voted yet." />
              <MessageBox kind="success" title="Settings saved" details="The new roles will apply from the next game." />
            </div>
          </Section>

          <Section label="5. Dialog (open on click)">
            <Dialog>
              <DialogTrigger asChild>
                <Button className={primaryBtn}>Open dialog</Button>
              </DialogTrigger>
              <DialogContent className="variant-F vf-paper max-w-md p-6">
                <DialogHeader>
                  <DialogTitle className="vf-display text-xl">Expel a villager?</DialogTitle>
                  <DialogDescription className="text-[15px]">
                    The villager will be removed from the register. This cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <DialogClose asChild><Button className={outlineBtn}>Cancel</Button></DialogClose>
                  <DialogClose asChild><Button className={dangerBtn}>Expel</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          <Section label="5b. Dialog (static look)">
            <Panel className="max-w-md">
              <p className="vf-display text-xl">Expel a villager?</p>
              <p className="mt-2 text-[15px]">The villager will be removed from the register. This cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-2">
                <Button className={outlineBtn}>Cancel</Button>
                <Button className={dangerBtn}>Expel</Button>
              </div>
            </Panel>
          </Section>

          <Section label="6. Toast (sonner)">
            <Toaster />
            <div className="flex flex-wrap gap-3">
              <Button className={dangerBtn} onClick={() => notify('error', 'Invalid game', 'The game you asked for does not exist or has ended.')}>Error toast</Button>
              <Button className={outlineBtn} onClick={() => notify('info', 'Village created', 'Share the code with your players so they can join.')}>Info toast</Button>
              <Button className={outlineBtn} onClick={() => notify('warning', 'Night is ending', 'Two players have not voted yet.')}>Warning toast</Button>
              <Button className={primaryBtn} onClick={() => notify('success', 'Settings saved', 'The new roles will apply from the next game.')}>Success toast</Button>
            </div>
          </Section>

          <Section label="7. Theme toggle and panel">
            <div className="flex flex-wrap items-center gap-4">
              <ThemeToggle className="rounded-full border-2 vf-brass-border" />
              <Panel className="max-w-xs">
                <p className="text-[15px]">Gilded parchment: the content container.</p>
              </Panel>
            </div>
          </Section>
        </div>
      </main>

      <Footer />
    </Stage>
  );
}
