import { Button } from '@/components/ui/button';

/*
 * Primary action button of the personal area (was the gradient .gradientButton of css/common.css).
 * Same props as before (id, disabled, onClick); now the felt button of the design system.
 */
export default function GradientButton({ id, disabled = false, onClick, children }) {
    return (
        <Button type="button" variant="felt" size="touch" id={id} disabled={disabled} onClick={onClick}
                className="min-w-[10rem] max-w-full text-base">
            {children}
        </Button>
    );
}
