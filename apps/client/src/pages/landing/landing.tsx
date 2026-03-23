import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const statuses = [
  { status: "Створено", bg: "bg-sky-500" },
  { status: "В процесі", bg: "bg-amber-500" },
  { status: "Надіслано", bg: "bg-violet-500" },
  { status: "Підтверджено", bg: "bg-emerald-500" },
];

const features = [
  {
    icon: FolderKanban,
    title: "Керування проєктами",
    description:
      "Створюйте проєкти, структуруйте задачі та контролюйте прогрес команди в одному місці.",
  },
  {
    icon: Workflow,
    title: "Розумний розподіл задач",
    description:
      "Підбір виконавців на основі навичок, досвіду, KPI та поточного навантаження.",
  },
  {
    icon: ClipboardList,
    title: "Контроль виконання",
    description:
      "Відстежуйте статуси, дедлайни, історію змін, повідомлення та вкладення без втрати контексту.",
  },
  {
    icon: Users,
    title: "Командна взаємодія",
    description:
      "Призначення, перевірка, повторне надсилання та прозора комунікація між виконавцями й менеджерами.",
  },
  {
    icon: ShieldCheck,
    title: "Ролі та доступи",
    description:
      "Гнучка система ролей для owner, manager та employee з чітким розподілом прав.",
  },
  {
    icon: Sparkles,
    title: "Сучасний інтерфейс",
    description:
      "Чистий дизайн, дошка задач, аналітика та швидка навігація в стилі сучасного SaaS-застосунку.",
  },
];

const stats = [
  { label: "Контроль задач", value: "100%" },
  { label: "Прозорість процесів", value: "24/7" },
  { label: "Актуальний статус", value: "Live" },
];

const steps = [
  {
    title: "Створення проєкту та формування команди",
    description:
      "Створення проєкту, додавання учасників і визначення їхніх ролей.",
  },
  {
    title: "Постановка задач в межах проекту",
    description:
      "Створення задач із описом, встановленням навичок, дедлайну та додатковими файлами.",
  },
  {
    title: "Підбір виконавця та контроль виконання",
    description:
      "Автоматизований підбір виконавця та відстеження статусу задачі.",
  },
  {
    title: "Перевірка результату й оновлення KPI",
    description:
      "Перевірка виконання задачі та оновлення показників працівника.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const detailsRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-violet-50/50 to-white text-zinc-900">
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-80px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-400/25 blur-3xl" />
            <div className="absolute left-[15%] top-[180px] h-[260px] w-[260px] rounded-full bg-fuchsia-300/20 blur-3xl" />
            <div className="absolute right-[12%] top-[120px] h-[300px] w-[300px] rounded-full bg-indigo-300/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_40%)]" />
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-4 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col gap-7"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-sm text-violet-700 shadow-sm backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                Інтелектуальне керування робочими процесами
              </div>

              <div className="space-y-5">
                <h1 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-5xl text-wrap">
                  Система управління робочими процесами та кадрами в ІТ-компанії
                </h1>
                <p className="max-w-xl text-lg leading-8 text-zinc-600">
                  FlowIT допомагає формувати команди, призначати задачі найбільш
                  релевантним виконавцям, контролювати дедлайни та підтримувати
                  прозору взаємодію між менеджерами та співробітниками.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    navigate("/projects");
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-300/40 transition-all duration-300 cursor-pointer hover:bg-violet-500"
                >
                  Почати роботу
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (detailsRef.current) {
                      detailsRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className="rounded-2xl border border-violet-200 bg-white/80 px-6 py-3 text-sm font-medium text-zinc-700 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-violet-300 hover:text-violet-700"
                >
                  Дізнатися більше
                </button>
              </div>

              <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    custom={index + 1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <div className="text-2xl font-semibold text-violet-600">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-violet-400/20 via-fuchsia-300/10 to-indigo-300/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-2xl shadow-violet-200/40 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-zinc-50/90 px-4 py-3">
                  <div>
                    <p className="text-sm text-zinc-500">Проєкт</p>
                    <p className="font-semibold">
                      Workflow & Personnel Management
                    </p>
                  </div>
                  <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                    Active
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="mb-3 text-sm font-medium text-zinc-500">
                      Підбір виконавця
                    </p>
                    <div className="space-y-3">
                      {[
                        ["SkillMatch", "0.92"],
                        ["ExperienceScore", "0.84"],
                        ["PerformanceScore", "0.88"],
                        ["Final Score", "0.89"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                        >
                          <span className="text-sm text-zinc-500">{label}</span>
                          <span className="font-semibold text-violet-600">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-violet-600 p-4 text-white shadow-lg shadow-violet-300/30">
                      <p className="text-sm text-violet-100">
                        Рекомендований виконавець
                      </p>
                      <p className="mt-1 text-lg +font-semibold">
                        Іванов Олександр
                      </p>
                      <p className="mt-2 text-sm text-violet-100">
                        Найкраща відповідність за навичками, KPI та досвідом.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="mb-3 text-sm font-medium text-zinc-500">
                        Статуси задач
                      </p>
                      <div className="space-y-2">
                        {statuses.map((item) => (
                          <div
                            key={item.status}
                            className="flex items-center gap-3 rounded-xl bg-white px-3 py-3"
                          >
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${item.bg}`}
                            />
                            <span className="text-sm text-zinc-700">
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          ref={detailsRef}
          id="features"
          className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-16"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
              Можливості системи
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Все необхідне для керування робочими процесами IT-команди
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Від постановки задач до підтвердження результатів і оновлення KPI
              — платформа підтримує весь життєвий цикл виконання завдань.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeUp}
                  className="group rounded-[1.75rem] border border-violet-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/60"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-zinc-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section
          id="process"
          className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-16"
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="rounded-[2rem] border border-violet-100 bg-linear-to-br from-violet-600 to-fuchsia-500 p-8 text-white shadow-2xl shadow-violet-200/40"
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-100">
                Як це працює
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Прозорий процес від постановки задачі до підтвердження
                результату
              </h2>
              <p className="mt-4 max-w-xl leading-8 text-violet-50/90">
                FlowIT поєднує розподіл задач, перевірку результатів, об’єктивну
                оцінку продуктивності та централізовану історію змін у єдиний
                робочий сценарій.
              </p>
            </motion.div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  className="flex gap-4 rounded-[1.5rem] border border-zinc-100 bg-white/90 p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 font-semibold text-violet-700">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-8 shadow-lg shadow-violet-100/40 backdrop-blur-sm"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
                  Переваги для команди
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Менше хаосу, більше контролю та краща ефективність виконання
                  задач
                </h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Розподіл задач за релевантністю виконавців",
                    "Контроль дедлайнів і навантаження",
                    "Гнучка історія статусів та перевірок",
                    "Оновлення KPI після підтвердженого виконання",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-zinc-50 px-4 py-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                      <p className="text-sm leading-6 text-zinc-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-gradient-to-br from-violet-600 to-violet-500 px-8 py-10 text-center text-white shadow-xl shadow-violet-200/50">
                <p className="text-sm text-violet-100">Готово до роботи</p>
                <p className="mt-2 text-4xl font-semibold">FlowIT</p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-violet-100">
                  Сучасна система для ефективного управління задачами,
                  персоналом та процесами.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          id="cta"
          className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-8 py-14 text-white shadow-2xl"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
                  Почніть зараз
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Створіть сучасний робочий простір для своєї команди разом із
                  FlowIT
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-300">
                  Об’єднайте управління задачами, ролями, продуктивністю та
                  комунікацією в єдиній системі з інтуїтивним інтерфейсом і
                  сучасною архітектурою.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    navigate("/projects");
                  }}
                  className="rounded-2xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 cursor-pointer hover:bg-violet-500"
                >
                  Спробувати FlowIT
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
