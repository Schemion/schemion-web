import { useMemo, useState } from "react"
import "./Faq.css"

const contentByLanguage = {
  ru: {
    badge: "Schemion Help Center",
    title: "FAQ: простые ответы на частые вопросы",
    intro: [
      "Этот FAQ написан для обычных пользователей и интеграторов, которым нужен быстрый и понятный старт.",
      "Мы собрали короткие практичные ответы без лишней терминологии, чтобы вы могли быстрее двигаться по работе.",
      "Важно: проект не рассчитан на крупные enterprise-решения, он ориентирован на default users, небольшие команды и экспериментаторов."
    ],
    languageLabel: "Язык",
    sections: [
      {
        title: "Начало работы",
        items: [
          {
            question: "Что это за сервис простыми словами?",
            answer: [
              "Это платформа, где вы можете загрузить свои данные, добавить модель и запускать задачи на обучение или предсказание.",
              "Она помогает собрать весь процесс в одном месте, чтобы не переключаться между разными инструментами.",
              "Если вам нужно быстро проверить идею или эксперимент, сервис для этого подходит очень хорошо."
            ]
          },
          {
            question: "Я новичок, мне будет сложно?",
            answer: [
              "Для базового сценария глубокой экспертизы не требуется.",
              "Обычно достаточно понять три вещи: что такое датасет, модель и задача.",
              "Если идти шаг за шагом, первый рабочий результат можно получить довольно быстро.",
              "Пример: регистрация -> загрузка данных -> запуск задачи -> просмотр результата."
            ]
          },
          {
            question: "Для каких задач сервис подходит лучше всего?",
            answer: [
              "Лучше всего он подходит для проверки гипотез, учебных проектов и небольших прикладных решений.",
              "Также он удобен, когда нужно быстро сравнить несколько моделей на одном наборе данных.",
              "Для больших корпоративных процессов с очень строгими требованиями обычно нужен другой класс платформ."
            ]
          },
          {
            question: "Нужно ли что-то устанавливать локально?",
            answer: [
              "Для обычного использования обычно достаточно доступа к вашему клиенту и аккаунта.",
              "Основные операции выполняются на стороне сервиса, а вы управляете процессом через интерфейс или интеграцию.",
              "Это снижает порог входа и экономит время на настройку окружения."
            ]
          }
        ]
      },
      {
        title: "Аккаунт и доступ",
        items: [
          {
            question: "Как быстро начать работу с аккаунтом?",
            answer: [
              "Сначала создайте аккаунт, затем выполните вход и работайте уже под своей учётной записью.",
              "После входа система понимает, какие данные и действия доступны именно вам.",
              "Если вход не проходит, сначала проверьте корректность почты и пароля.",
              "Если проблема повторяется, попробуйте выйти и войти заново."
            ]
          },
          {
            question: "Почему у разных пользователей разные возможности?",
            answer: [
              "В сервисе используется ролевая модель доступа.",
              "Это значит, что часть действий может быть доступна только определённым ролям.",
              "Так снижается риск случайных изменений в чужих или системных данных.",
              "Если вам не хватает прав, лучше запросить доступ у администратора."
            ]
          },
          {
            question: "Вижу ли я данные других людей?",
            answer: [
              "Нет, данные разделены по пользователям.",
              "Обычно вы работаете только со своими датасетами, моделями и задачами.",
              "Это сделано для безопасности и приватности работы в общем сервисе.",
              "Если кажется, что доступ лишний, лучше сразу сообщить в поддержку проекта."
            ]
          }
        ]
      },
      {
        title: "Датасеты",
        items: [
          {
            question: "Какой датасет лучше подготовить перед загрузкой?",
            answer: [
              "Самый удобный вариант - аккуратный ZIP-архив с изображениями и аннотациями.",
              "Главная рекомендация: сделайте понятную структуру файлов и уберите лишние служебные папки.",
              "Чем чище структура, тем меньше шансов на ошибку при загрузке.",
              "Перед отправкой полезно открыть архив и проверить его вручную."
            ]
          },
          {
            question: "Что делать, если датасет не загружается?",
            answer: [
              "Чаще всего причина в проблемной структуре архива или повреждённом файле.",
              "Пересоберите ZIP и убедитесь, что в нём есть все нужные данные.",
              "Если размер очень большой, лучше заранее проверить ограничения в вашем сценарии.",
              "После исправления обычно повторная загрузка проходит без сложностей."
            ]
          },
          {
            question: "Можно ли потом скачать или удалить датасет?",
            answer: [
              "Да, это стандартный рабочий сценарий.",
              "Скачивание удобно для проверки исходных файлов, а удаление - для наведения порядка.",
              "Перед удалением убедитесь, что датасет не нужен в текущих задачах.",
              "Так вы избежите лишних повторных загрузок."
            ]
          },
          {
            question: "Почему новый датасет не сразу виден в списке?",
            answer: [
              "Иногда список обновляется с небольшой задержкой.",
              "Это нормальное поведение для сервисов с кэшированием, чтобы интерфейс работал быстрее.",
              "Обычно помогает просто обновить экран через несколько секунд.",
              "Если объект нужен срочно, откройте его напрямую по идентификатору."
            ]
          }
        ]
      },
      {
        title: "Модели",
        items: [
          {
            question: "Какие файлы модели можно использовать?",
            answer: [
              "Сервис ожидает файлы модели в поддерживаемых форматах, обычно `.pt` или `.pth`.",
              "Если формат или размер не подходят, загрузка будет отклонена.",
              "Чтобы не терять время, лучше проверить файл заранее перед отправкой.",
              "Это самый частый и самый простой шаг, который предотвращает ошибки."
            ]
          },
          {
            question: "Как понять, что модель загрузилась успешно?",
            answer: [
              "После загрузки у модели появляется карточка или запись с основными данными.",
              "Если запись появилась и открывается, значит базовый этап прошёл успешно.",
              "Дальше можно использовать модель в задачах и смотреть метрики.",
              "Пример: загрузили модель -> открыли её страницу -> запустили задачу."
            ]
          },
          {
            question: "Можно ли хранить несколько версий одной модели?",
            answer: [
              "Да, это хорошая практика для экспериментов.",
              "Лучше сразу договориться о понятных названиях версий, чтобы не путаться.",
              "Так проще сравнивать результаты и возвращаться к стабильной версии.",
              "Это особенно полезно, когда вы тестируете много гипотез подряд."
            ]
          },
          {
            question: "Почему модель отклоняется при загрузке?",
            answer: [
              "Обычно причина в неподходящем формате, размере файла или повреждении при экспорте.",
              "Проверьте файл и повторите загрузку после исправления.",
              "Если ошибка повторяется, полезно взять другой экспорт той же модели и сравнить.",
              "Так проще понять, проблема в файле или в процессе подготовки."
            ]
          }
        ]
      },
      {
        title: "Задачи обучения и инференса",
        items: [
          {
            question: "В чём разница между обучением и инференсом?",
            answer: [
              "Обучение улучшает или дообучает модель на данных.",
              "Инференс использует уже готовую модель, чтобы получить предсказания.",
              "Если цель - повысить качество модели, выбирают обучение.",
              "Если цель - быстро получить результат на новых данных, выбирают инференс."
            ]
          },
          {
            question: "Как правильно запускать задачи, чтобы было меньше ошибок?",
            answer: [
              "Перед запуском проверьте, что датасет и модель действительно готовы и доступны вам.",
              "Затем запускайте задачу с минимально необходимыми параметрами.",
              "Если всё прошло успешно, уже потом добавляйте дополнительные настройки.",
              "Такой подход помогает быстрее найти причину, если что-то пошло не так."
            ]
          },
          {
            question: "Как следить за задачей в процессе выполнения?",
            answer: [
              "Обычно задача проходит стадии ожидания, выполнения и завершения.",
              "Вы можете наблюдать статус в реальном времени или периодически проверять обновления.",
              "Если связь прервалась, просто откройте задачу снова и проверьте текущий статус.",
              "Для пользователя важно смотреть именно финальный статус, а не промежуточный."
            ]
          },
          {
            question: "Где смотреть результат после завершения задачи?",
            answer: [
              "Когда задача завершилась успешно, появляется ссылка или файл результата.",
              "Если результата нет, сначала убедитесь, что статус действительно успешный.",
              "При ошибочном статусе полезно посмотреть текст причины и перезапустить задачу.",
              "Пример: задача failed -> исправили входные данные -> запустили повторно."
            ]
          }
        ]
      },
      {
        title: "Ошибки и диагностика",
        items: [
          {
            question: "Что означают статусы задачи?",
            answer: [
              "Ожидание означает, что задача стоит в очереди.",
              "Выполнение означает, что задача уже обрабатывается.",
              "Успешно - результат готов, ошибка - нужно посмотреть причину и исправить входные данные.",
              "Это базовая схема, которой обычно достаточно для ежедневной работы."
            ]
          },
          {
            question: "Что делать, если задача слишком долго в ожидании?",
            answer: [
              "Чаще всего это означает высокую нагрузку на очередь.",
              "Подождите немного и проверьте, меняется ли статус со временем.",
              "Если долго ничего не происходит, стоит проверить состояние сервиса и воркеров.",
              "Для интерфейса лучше показывать пользователю, что задача принята и ждёт обработку."
            ]
          },
          {
            question: "Как быстрее находить причину ошибки?",
            answer: [
              "Начинайте с самого простого: проверьте файл, входные поля и права доступа.",
              "Затем повторите запуск с минимальными настройками.",
              "Если минимальный вариант работает, проблема обычно в одном из дополнительных параметров.",
              "Так вы локализуете ошибку быстрее, чем при полном повторе сложного сценария."
            ]
          },
          {
            question: "Что делать при частых ограничениях по запросам?",
            answer: [
              "Уменьшите частоту отправки запросов и добавьте небольшие паузы между повторами.",
              "Не стоит отправлять десятки мгновенных повторов подряд.",
              "Так вы снижаете нагрузку и получаете более стабильное поведение.",
              "Практически это особенно важно для интеграций с автоповтором."
            ]
          }
        ]
      },
      {
        title: "Безопасность и приватность",
        items: [
          {
            question: "Насколько безопасны мои данные в сервисе?",
            answer: [
              "Доступ к данным защищён аутентификацией и правилами ролей.",
              "Пользователь работает в своей области данных, что уменьшает риск пересечения с чужими объектами.",
              "При нормальном использовании это обеспечивает понятный базовый уровень защиты.",
              "Для чувствительных сценариев важно дополнительно соблюдать ваши внутренние правила безопасности."
            ]
          },
          {
            question: "Как безопасно работать с файлами и ссылками на скачивание?",
            answer: [
              "Ссылки на скачивание обычно ограничены по времени.",
              "Если ссылка перестала работать, чаще всего нужно запросить новую.",
              "Не публикуйте такие ссылки в открытом доступе и не храните их в общих логах.",
              "Это простой, но важный шаг для защиты файлов."
            ]
          },
          {
            question: "Что важно помнить интегратору про безопасность?",
            answer: [
              "Храните данные доступа аккуратно и не передавайте их третьим лицам.",
              "Проверяйте входные данные до отправки, особенно файлы и идентификаторы.",
              "Желательно вести журнал ключевых действий, чтобы проще разбирать спорные ситуации.",
              "Это повышает предсказуемость и безопасность работы сервиса в вашем продукте."
            ]
          },
          {
            question: "Подходит ли сервис для тяжёлых enterprise-процессов?",
            answer: [
              "Сейчас сервис ориентирован не на крупные enterprise-внедрения.",
              "Он рассчитан на обычных пользователей, небольшие команды и экспериментаторов.",
              "Если вам нужны очень жёсткие корпоративные требования, лучше заранее оценить ограничения.",
              "Так вы избежите завышенных ожиданий и выберете подходящий сценарий использования."
            ]
          }
        ]
      }
    ],
    quickFixesTitle: "Частые проблемы и быстрые решения",
    quickFixesIntro:
      "Короткий формат: проблема -> причина -> решение.",
    quickCauseLabel: "Причина",
    quickSolutionLabel: "Решение",
    quickFixes: [
      {
        problem: "Не получается войти",
        cause: "Неверный логин/пароль или завершилась сессия",
        solution: "Проверьте данные входа, войдите заново и убедитесь, что используете актуальную сессию"
      },
      {
        problem: "Нет доступа к нужному разделу",
        cause: "У роли пользователя недостаточно прав",
        solution: "Попросите администратора выдать нужный уровень доступа"
      },
      {
        problem: "Датасет не загружается",
        cause: "ZIP повреждён или структура файлов не подходит",
        solution: "Пересоберите архив и проверьте, что в нём есть изображения и аннотации"
      },
      {
        problem: "Модель не принимается",
        cause: "Неподдерживаемый формат или слишком большой файл",
        solution: "Проверьте формат `.pt/.pth`, размер и повторите загрузку"
      },
      {
        problem: "Задача долго в ожидании",
        cause: "Очередь перегружена",
        solution: "Подождите, обновите статус позже и избегайте лишних повторных запусков"
      },
      {
        problem: "Задача завершилась с ошибкой",
        cause: "Некорректные входные данные или недоступный объект",
        solution: "Проверьте входные параметры, исправьте их и запустите задачу снова"
      },
      {
        problem: "Нет результата после завершения",
        cause: "Задача не завершилась успешно",
        solution: "Проверьте финальный статус и текст ошибки, затем повторите запуск"
      },
      {
        problem: "Ссылка на скачивание не работает",
        cause: "Ссылка устарела",
        solution: "Запросите новую ссылку и скачайте файл сразу после получения"
      },
      {
        problem: "Новый объект не виден в списке",
        cause: "Временная задержка обновления списка",
        solution: "Подождите несколько секунд и обновите экран"
      },
      {
        problem: "Слишком часто появляются ограничения по запросам",
        cause: "Слишком много повторов за короткое время",
        solution: "Уменьшите частоту запросов и добавьте паузы между попытками"
      },
      {
        problem: "Сбиваются обновления статуса в реальном времени",
        cause: "Нестабильное соединение",
        solution: "Переподключитесь и используйте периодическое обновление как запасной вариант"
      },
      {
        problem: "Сложно понять, с чего начать",
        cause: "Запуск без базового порядка шагов",
        solution: "Следуйте рекомендованному флоу ниже: от аккаунта к задаче и результату"
      }
    ],
    recommendedFlowTitle: "Рекомендуемый пользовательский флоу",
    recommendedFlow: [
      "Создайте аккаунт и войдите в систему.",
      "Подготовьте и загрузите датасет в понятной структуре.",
      "Загрузите модель и проверьте, что она отображается корректно.",
      "Запустите задачу обучения или инференса с базовыми параметрами.",
      "Следите за статусом задачи до финального результата.",
      "После успешного завершения скачайте результат и проверьте качество.",
      "При необходимости повторите цикл с обновлёнными данными или новой версией модели."
    ],
    nextVersionTitle: "Что улучшится в следующих версиях",
    nextVersionItems: [
      "Более понятные тексты ошибок и подсказки прямо в пользовательском потоке.",
      "Более удобное отслеживание статусов при большом количестве задач.",
      "Дополнительные рекомендации по подготовке данных до загрузки.",
      "Улучшения стабильности и скорости работы при пиковых нагрузках.",
      "Постепенное развитие пользовательского опыта без резких изменений в базовых сценариях."
    ]
  },
  en: {
    badge: "Schemion Help Center",
    title: "FAQ: simple answers to common questions",
    intro: [
      "This FAQ is written for everyday users and technical integrators who want clear and fast guidance.",
      "You will find short practical answers without heavy jargon, so it is easier to move forward.",
      "Important: this project is not designed for large enterprise solutions; it targets default users, small teams, and experimenters."
    ],
    languageLabel: "Language",
    sections: [
      {
        title: "Getting started",
        items: [
          {
            question: "What does this service do in plain words?",
            answer: [
              "It is a platform where you upload data, add a model, and run training or prediction tasks.",
              "It keeps the workflow in one place, so you do not need to jump between many tools.",
              "If you want to test ideas quickly, this setup works very well."
            ]
          },
          {
            question: "I am new to this. Will it be hard?",
            answer: [
              "For the basic flow, deep ML expertise is not required.",
              "You mainly need to understand three things: dataset, model, and task.",
              "If you follow the flow step by step, first results usually come quickly.",
              "Example: sign in -> upload data -> run task -> check output."
            ]
          },
          {
            question: "What kind of work is this platform best for?",
            answer: [
              "It is best for experiments, learning projects, and compact production use cases.",
              "It is also useful when you want to compare multiple model versions quickly.",
              "For very large enterprise processes, another class of platform is often needed."
            ]
          },
          {
            question: "Do I need a complex local setup?",
            answer: [
              "For standard usage, you usually just need your client access and account.",
              "Most heavy operations run on the service side while you control the workflow.",
              "This keeps onboarding lightweight and practical."
            ]
          }
        ]
      },
      {
        title: "Account and access",
        items: [
          {
            question: "How do I start with my account quickly?",
            answer: [
              "Create an account, sign in, and continue work under your profile.",
              "After sign-in, the system knows which actions and data are available to you.",
              "If sign-in fails, check your credentials first.",
              "If needed, sign out and sign in again to refresh the session."
            ]
          },
          {
            question: "Why do different users have different capabilities?",
            answer: [
              "The platform uses role-based access.",
              "That means some actions are available only for specific roles.",
              "This reduces the risk of accidental changes to protected areas.",
              "If you need more access, request it from an administrator."
            ]
          },
          {
            question: "Why can’t I see the admin area?",
            answer: [
              "That is expected behavior for non-admin users.",
              "Even with a direct link, permissions are checked before access is granted.",
              "If admin features are required for your work, ask your admin team for the proper role."
            ]
          },
          {
            question: "Can I see other users’ data?",
            answer: [
              "Normally, no.",
              "Users work in isolated data scopes and should only see their own objects.",
              "This is part of the platform’s basic privacy model.",
              "If you notice unusual visibility, report it to support."
            ]
          }
        ]
      },
      {
        title: "Datasets",
        items: [
          {
            question: "How should I prepare my dataset before upload?",
            answer: [
              "The easiest path is a clean ZIP archive with images and annotation files.",
              "Keep folder structure clear and remove unrelated files.",
              "Cleaner archives usually mean fewer upload errors.",
              "A quick manual check before upload saves time later."
            ]
          },
          {
            question: "What if dataset upload fails?",
            answer: [
              "The most common reasons are broken ZIP structure or corrupted files.",
              "Rebuild the archive and verify required content is present.",
              "If files are very large, confirm your limits in advance.",
              "After cleanup, upload usually works on the next try."
            ]
          },
          {
            question: "Can I download or delete datasets later?",
            answer: [
              "Yes, both are normal actions in day-to-day use.",
              "Downloading is useful for verification, and deletion helps with cleanup.",
              "Before deleting, make sure the dataset is not needed by active tasks.",
              "That prevents avoidable rework."
            ]
          },
          {
            question: "Why doesn’t a new dataset appear immediately in lists?",
            answer: [
              "List updates can be slightly delayed in some cases.",
              "This is expected in cached systems optimized for responsiveness.",
              "Usually, refreshing after a few seconds is enough.",
              "If urgent, open the object directly by its identifier."
            ]
          }
        ]
      },
      {
        title: "Models",
        items: [
          {
            question: "Which model files are accepted?",
            answer: [
              "The service expects supported model formats, typically `.pt` or `.pth`.",
              "If file format or size is outside limits, upload is rejected.",
              "A quick pre-check before upload prevents most failures.",
              "This is the simplest way to avoid repeated retries."
            ]
          },
          {
            question: "How do I know model upload succeeded?",
            answer: [
              "After upload, the model should appear as an available object in your workspace.",
              "If it opens and basic info is visible, the upload stage is successful.",
              "You can then run tasks and inspect model outcomes.",
              "Example: upload model -> open model card -> launch task."
            ]
          },
          {
            question: "Can I keep multiple versions of one model?",
            answer: [
              "Yes, and it is a recommended habit for experiments.",
              "Use a clear naming pattern so versions are easy to track.",
              "That makes comparisons easier and rollbacks safer.",
              "It is especially useful when testing many hypotheses."
            ]
          },
          {
            question: "Why is model upload being rejected?",
            answer: [
              "The most common causes are unsupported format, oversized file, or a broken export.",
              "Validate the file and try again.",
              "If it still fails, compare with another export of the same model.",
              "This helps isolate whether the issue is in the file or preparation step."
            ]
          }
        ]
      },
      {
        title: "Training and inference tasks",
        items: [
          {
            question: "What is the difference between training and inference?",
            answer: [
              "Training improves or fine-tunes a model using your data.",
              "Inference uses an already trained model to produce predictions.",
              "Choose training when your goal is better model quality.",
              "Choose inference when your goal is fast results on new data."
            ]
          },
          {
            question: "How do I launch tasks with fewer errors?",
            answer: [
              "Before launch, confirm dataset and model are ready and available to your account.",
              "Start with minimal required settings first.",
              "Once that works, add optional parameters step by step.",
              "This approach makes troubleshooting much easier."
            ]
          },
          {
            question: "How can I track progress while a task is running?",
            answer: [
              "Tasks usually move through waiting, running, and finished states.",
              "You can monitor updates live or check status periodically.",
              "If connection drops, reopen the task and read current state.",
              "For decisions, always trust the final status."
            ]
          },
          {
            question: "Where can I find results after completion?",
            answer: [
              "When a task finishes successfully, result output becomes available for download or view.",
              "If output is missing, verify that status is truly successful.",
              "If status shows failure, read the reason and rerun after fixing inputs.",
              "Example: failed run -> fix input -> rerun -> check final output."
            ]
          }
        ]
      },
      {
        title: "Errors and diagnostics",
        items: [
          {
            question: "How should I read task statuses?",
            answer: [
              "Waiting means the task is accepted and queued.",
              "Running means processing is active.",
              "Succeeded means output is ready, failed means something needs correction.",
              "This simple model is enough for most daily workflows."
            ]
          },
          {
            question: "What if a task stays waiting for too long?",
            answer: [
              "This usually indicates queue load.",
              "Wait a bit and check whether status changes over time.",
              "If nothing changes for long, verify worker and service health.",
              "In UI, it helps to clearly show that the task is accepted and pending."
            ]
          },
          {
            question: "What is the fastest way to troubleshoot errors?",
            answer: [
              "Start simple: check files, input fields, and access rights.",
              "Then rerun with minimal settings.",
              "If minimal flow works, the issue is often in one optional parameter.",
              "This method isolates root causes faster than rerunning full complex inputs."
            ]
          },
          {
            question: "What should I do when rate limits happen often?",
            answer: [
              "Reduce request frequency and add small delays between retries.",
              "Avoid burst retries with many immediate repeated calls.",
              "This lowers system pressure and improves reliability.",
              "It is especially important for auto-retry integrations."
            ]
          }
        ]
      },
      {
        title: "Security and privacy",
        items: [
          {
            question: "Is my data safe on this platform?",
            answer: [
              "Access is protected by authentication and role rules.",
              "Users operate inside their own data scope, which limits cross-user visibility.",
              "For normal usage this provides a practical baseline of protection.",
              "For sensitive workloads, apply your internal security policies as well."
            ]
          },
          {
            question: "How should I handle file download links safely?",
            answer: [
              "Download links are usually time-limited.",
              "If a link stops working, request a fresh one.",
              "Do not expose such links in public places or shared logs.",
              "This simple habit significantly improves file safety."
            ]
          },
          {
            question: "What should integrators remember about security?",
            answer: [
              "Store access data carefully and avoid sharing credentials.",
              "Validate incoming inputs before sending anything to the service.",
              "Keep logs for key actions so incidents are easier to investigate.",
              "These practices improve reliability and trust in production use."
            ]
          },
          {
            question: "Is this platform a fit for heavy enterprise governance?",
            answer: [
              "At this stage, the platform is not aimed at large enterprise governance workflows.",
              "It is built for regular users, small teams, and experiment-driven work.",
              "If you need strict enterprise controls, evaluate constraints early.",
              "Clear expectations help choose the right usage model from the start."
            ]
          }
        ]
      }
    ],
    quickFixesTitle: "Common issues and quick fixes",
    quickFixesIntro:
      "Short format: problem -> cause -> solution.",
    quickCauseLabel: "Cause",
    quickSolutionLabel: "Solution",
    quickFixes: [
      {
        problem: "Cannot sign in",
        cause: "Wrong credentials or expired session",
        solution: "Check login data, sign in again, and verify you are using an active session"
      },
      {
        problem: "Missing access to a section",
        cause: "Role does not include required permissions",
        solution: "Ask an administrator to grant the right access level"
      },
      {
        problem: "Dataset upload fails",
        cause: "Broken ZIP or invalid folder structure",
        solution: "Rebuild the archive and confirm it includes images and annotations"
      },
      {
        problem: "Model is rejected",
        cause: "Unsupported format or file too large",
        solution: "Check `.pt/.pth` format and size limits, then upload again"
      },
      {
        problem: "Task is waiting too long",
        cause: "Queue is under load",
        solution: "Wait, check status later, and avoid unnecessary duplicate launches"
      },
      {
        problem: "Task ends with failure",
        cause: "Invalid inputs or missing dependency",
        solution: "Review inputs, fix them, and rerun the task"
      },
      {
        problem: "No output after task completion",
        cause: "Task did not finish successfully",
        solution: "Check final status and error reason, then rerun with corrected data"
      },
      {
        problem: "Download link does not work",
        cause: "Link expired",
        solution: "Request a new link and use it promptly"
      },
      {
        problem: "New object not visible in list",
        cause: "Temporary list refresh delay",
        solution: "Wait a few seconds and refresh"
      },
      {
        problem: "Rate limits happen too often",
        cause: "Too many requests in a short time",
        solution: "Reduce request rate and add small retry delays"
      },
      {
        problem: "Live status updates disconnect",
        cause: "Unstable network connection",
        solution: "Reconnect and use periodic checks as fallback"
      },
      {
        problem: "Not sure where to begin",
        cause: "Skipping the basic workflow order",
        solution: "Follow the recommended user flow below from account to result"
      }
    ],
    recommendedFlowTitle: "Recommended user flow",
    recommendedFlow: [
      "Create an account and sign in.",
      "Prepare and upload your dataset in a clear structure.",
      "Upload a model and confirm it appears correctly.",
      "Launch a training or inference task with baseline settings.",
      "Track task status until final completion.",
      "After success, download output and validate quality.",
      "Repeat the cycle with updated data or a new model version if needed."
    ],
    nextVersionTitle: "What may improve in upcoming versions",
    nextVersionItems: [
      "Clearer error messages and user-facing guidance in common flows.",
      "Better status tracking experience for many parallel tasks.",
      "More practical guidance for dataset preparation before upload.",
      "Stability and performance improvements under peak load.",
      "Steady UX improvements without breaking core workflows."
    ]
  }
}

const languageButtons = [
  { value: "ru", label: "RU" },
  { value: "en", label: "EN" }
]

export default function Faq() {
  const [language, setLanguage] = useState("ru")

  const content = useMemo(() => contentByLanguage[language], [language])

  return (
    <div className="page faq-page">
      <section className="card faq-hero">
        <span className="faq-badge">{content.badge}</span>
        <h1>{content.title}</h1>
        {content.intro.map((line) => (
          <p key={line}>{line}</p>
        ))}

        <div className="faq-language-row">
          <span>{content.languageLabel}</span>
          <div className="faq-language-switch" role="tablist" aria-label={content.languageLabel}>
            {languageButtons.map((button) => (
              <button
                key={button.value}
                type="button"
                className={language === button.value ? "active" : ""}
                onClick={() => setLanguage(button.value)}
                aria-selected={language === button.value}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-sections">
        {content.sections.map((section) => (
          <article className="card faq-section-card" key={section.title}>
            <h2>{section.title}</h2>
            <div className="faq-questions-grid">
              {section.items.map((item) => (
                <div className="faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  {item.answer.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="card faq-quickfix-card">
        <h2>{content.quickFixesTitle}</h2>
        <p className="faq-muted">{content.quickFixesIntro}</p>
        <div className="faq-quickfix-list">
          {content.quickFixes.map((item, index) => (
            <article className="faq-quickfix-item" key={`${item.problem}-${index}`}>
              <h3>
                {index + 1}. {item.problem}
              </h3>
              <p>
                <strong>{content.quickCauseLabel}:</strong> {item.cause}
              </p>
              <p>
                <strong>{content.quickSolutionLabel}:</strong> {item.solution}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="card faq-flow-card">
        <h2>{content.recommendedFlowTitle}</h2>
        <ol>
          {content.recommendedFlow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="card faq-next-card">
        <h2>{content.nextVersionTitle}</h2>
        <ul>
          {content.nextVersionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
