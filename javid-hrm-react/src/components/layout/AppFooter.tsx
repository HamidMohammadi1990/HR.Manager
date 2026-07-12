import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useSidebar } from '@/hooks';

export function AppFooter() {
  const { hideSidebar, expandSidebar } = useSidebar();

  return (
    <footer className="bg-sidebar fixed inset-x-0 bottom-0 z-40 hidden h-(--footer-height) justify-between border-t lg:flex">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={hideSidebar}
          data-tooltip="مخفی کردن"
        >
          <Icon name="flowbite:open-sidebar-solid" className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={expandSidebar}
          data-tooltip="نمایش کردن"
        >
          <Icon name="flowbite:close-sidebar-solid" className="size-4" />
        </Button>
      </div>
    </footer>
  );
}
