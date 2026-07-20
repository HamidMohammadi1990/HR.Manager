import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const FAQ_ITEMS = [
  {
    question: 'چطور مرخصی ثبت کنم؟',
    answer:
      'از منوی پرسنل وارد بخش «مرخصی‌ها» شوید، روی «درخواست جدید» کلیک کنید و تاریخ شروع و پایان را به‌صورت شمسی وارد کنید.',
    link: '/leaves',
  },
  {
    question: 'چطور حضور و غیاب را ثبت کنم؟',
    answer:
      'در صفحه «حضور و غیاب» می‌توانید ورود و خروج را با تاریخ شمسی و ساعت جداگانه ثبت یا ویرایش کنید.',
    link: '/attendance',
  },
  {
    question: 'رمز عبور را از کجا تغییر دهم؟',
    answer:
      'از منوی کاربر بالای صفحه به «تنظیمات» یا «تنظیمات حساب» بروید و بخش تغییر رمز عبور را تکمیل کنید.',
    link: '/account-settings',
  },
  {
    question: 'اعلان‌ها کجا نمایش داده می‌شوند؟',
    answer:
      'از آیکون زنگوله در هدر می‌توانید اعلان‌های اخیر را ببینید یا از منوی ابزارها وارد صفحه «اعلان‌ها» شوید.',
    link: '/notifications',
  },
];

const QUICK_LINKS = [
  { title: 'داشبورد', description: 'نمای کلی وضعیت سازمان', href: '/', icon: 'material-symbols:dashboard' },
  { title: 'پروفایل کاربری', description: 'اطلاعات شخصی و ویرایش حساب', href: '/profile', icon: 'material-symbols:person' },
  { title: 'تنظیمات', description: 'تم، اعلان‌ها و ترجیحات', href: '/settings', icon: 'material-symbols:settings' },
  { title: 'پشتیبان‌گیری', description: 'مدیریت نسخه‌های پشتیبان', href: '/backup', icon: 'material-symbols:backup' },
];

const SUPPORT_CHANNELS = [
  {
    title: 'ایمیل پشتیبانی',
    value: 'support@javidhrm.local',
    hint: 'پاسخ در روزهای کاری تا ۲۴ ساعت',
    icon: 'material-symbols:mail',
    action: 'mailto:support@javidhrm.local',
  },
  {
    title: 'تلفن پشتیبانی',
    value: '۰۲۱-۹۱۰۰۰۰۰۰',
    hint: 'شنبه تا چهارشنبه، ۹ تا ۱۷',
    icon: 'material-symbols:call',
    action: 'tel:+982191000000',
  },
  {
    title: 'راهنمای آنلاین',
    value: 'مستندات داخلی سامانه',
    hint: 'سوالات متداول و مسیرهای میانبر',
    icon: 'material-symbols:menu-book',
    action: '#faq',
  },
];

export default function HelpSupportPage() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(FAQ_ITEMS[0]?.question ?? null);

  const filteredFaq = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="flex-1 p-4 lg:p-6" dir="rtl">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="from-primary/10 via-background to-emerald-500/10 overflow-hidden rounded-2xl border bg-linear-to-br p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="secondary">مرکز راهنما</Badge>
              <h1 className="text-2xl font-bold sm:text-3xl">راهنما و پشتیبانی</h1>
              <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
                پاسخ سوالات پرتکرار، مسیرهای سریع به بخش‌های مهم و راه‌های ارتباط با تیم پشتیبانی را اینجا پیدا کنید.
              </p>
            </div>
            <div className="bg-card/80 flex size-16 items-center justify-center rounded-2xl border shadow-xs backdrop-blur-sm">
              <Icon name="material-symbols:support-agent" className="text-primary size-8" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SUPPORT_CHANNELS.map((channel) => (
            <Card key={channel.title} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                    <Icon name={channel.icon} className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{channel.title}</CardTitle>
                    <CardDescription>{channel.hint}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-medium">{channel.value}</p>
                {channel.action.startsWith('#') ? (
                  <a href={channel.action} className="text-primary text-sm hover:underline">
                    مشاهده سوالات متداول
                  </a>
                ) : (
                  <a href={channel.action} className="text-primary text-sm hover:underline">
                    ارتباط با پشتیبانی
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card id="faq">
            <CardHeader>
              <CardTitle>سوالات متداول</CardTitle>
              <CardDescription>جستجو کنید یا روی هر سوال کلیک کنید تا پاسخ نمایش داده شود.</CardDescription>
              <div className="pt-2">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو در راهنما..."
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredFaq.length === 0 ? (
                <p className="text-muted-foreground text-sm">موردی با این عبارت پیدا نشد.</p>
              ) : (
                filteredFaq.map((item) => {
                  const isOpen = openFaq === item.question;
                  return (
                    <div key={item.question} className="rounded-xl border">
                      <button
                        type="button"
                        className="hover:bg-muted/40 flex w-full items-center justify-between gap-3 px-4 py-3 text-start"
                        onClick={() => setOpenFaq(isOpen ? null : item.question)}
                      >
                        <span className="font-medium">{item.question}</span>
                        <Icon
                          name="material-symbols:keyboard-arrow-down"
                          className={cn('text-muted-foreground size-5 transition-transform', isOpen && 'rotate-180')}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t px-4 py-3">
                          <p className="text-muted-foreground text-sm leading-7">{item.answer}</p>
                          <Link to={item.link} className="text-primary mt-3 inline-flex items-center gap-1 text-sm hover:underline">
                            رفتن به بخش مربوطه
                            <Icon name="material-symbols:arrow-forward" className="size-4 rtl:rotate-180" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>دسترسی سریع</CardTitle>
                <CardDescription>میانبر به صفحات پرکاربرد</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="hover:bg-muted/50 flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors"
                  >
                    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                      <Icon name={item.icon} className="text-primary size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-muted-foreground truncate text-xs">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>نیاز به کمک بیشتر دارید؟</CardTitle>
                <CardDescription>تیم پشتیبانی آماده پیگیری درخواست شماست.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm leading-7">
                  اگر مشکل فنی، خطای سیستم یا سوال عملیاتی دارید، ایمیل یا تلفن پشتیبانی را انتخاب کنید.
                  هنگام تماس، نام کاربری و شرح کوتاه مشکل را ذکر کنید.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="mailto:support@javidhrm.local" className="button">ارسال ایمیل</a>
                  <Link to="/profile" className="button" data-variant="outline">مشاهده پروفایل</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
