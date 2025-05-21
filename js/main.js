/**
 * The Hatters - Сайт музыкальной группы
 * Основной JavaScript файл
 */

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // ===== Мобильное меню =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Переключение мобильного меню
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    // Добавляем обработчик клика на гамбургер
    hamburger.addEventListener('click', toggleMobileMenu);

    // ===== Плавная прокрутка для навигационных ссылок =====
    document.querySelectorAll('.nav-menu a, a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            // Предотвращаем стандартное поведение ссылки
            e.preventDefault();

            // Получаем ID секции из атрибута href
            const targetId = this.getAttribute("href");

            // Проверяем, что это внутренняя ссылка
            if (targetId.startsWith("#")) {
                // Находим целевой элемент
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Закрываем мобильное меню
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");

                    // Плавно прокручиваем к элементу
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Вычитаем высоту шапки
                        behavior: "smooth",
                    });

                    // Обновляем URL без перезагрузки страницы
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ===== Анимация при скролле =====
    const scrollElements = document.querySelectorAll('.animate-on-scroll');

    // Проверяем, находится ли элемент в области видимости
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    };

    // Добавляем класс 'show' элементам в области видимости
    const displayScrollElement = (element) => {
        element.classList.add('show');
    };

    // Обрабатываем анимацию при скролле
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (isElementInViewport(el)) {
                displayScrollElement(el);
            }
        });
    };

    // Запускаем один раз при загрузке страницы
    handleScrollAnimation();

    // Запускаем при скролле
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // ===== Видео =====
    const videoSlider = document.querySelector('.video-slider');
    const videoSliderContainer = document.querySelector('.video-slider-container');
    const videoPrevBtn = document.querySelector('.prev-btn');
    const videoNextBtn = document.querySelector('.next-btn');
    const videos = document.querySelectorAll('.video-slider video');

    if (videoSlider && videos.length > 0) {
        let currentVideoIndex = 0;

        function showVideo(index) {
            videos.forEach((video, i) => {
                video.style.display = i === index ? 'block' : 'none';
            });
        }

        function nextVideo() {
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            showVideo(currentVideoIndex);
        }

        function prevVideo() {
            currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
            showVideo(currentVideoIndex);
        }

        // Инициализация
        showVideo(currentVideoIndex);

        // Обработчики событий
        videoPrevBtn.addEventListener('click', prevVideo);
        videoNextBtn.addEventListener('click', nextVideo);
    }

    // ===== Валидация формы подписки на новости =====
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    // Вспомогательная функция для отображения сообщений об ошибке
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    // Вспомогательная функция для проверки формата электронной почты
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Сбрасываем предыдущие ошибки
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
                const errorMessage = group.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            });

            // Получаем поля формы
            const city = document.getElementById('city');
            const email = document.getElementById('email');

            let isValid = true;

            // Валидируем город
            if (city.value.trim() === '') {
                showError(city, 'Пожалуйста, введите ваш город');
                isValid = false;
            }

            // Валидируем email
            if (email.value.trim() === '') {
                showError(email, 'Пожалуйста, введите ваш email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Пожалуйста, введите корректный email адрес');
                isValid = false;
            }

            // Если форма валидна, отправляем её
            if (isValid) {
                // Сохраняем введенный город для персонализации сообщения
                const cityName = city.value.trim();

                // Очищаем форму
                contactForm.reset();

                // Обновляем текст сообщения об успехе
                formSuccess.innerHTML = `
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Спасибо за подписку!</h3>
                    <p>Теперь вы будете получать новости о концертах в городе ${cityName} и других городах.</p>
                    <p>Следите за нашими обновлениями!</p>
                `;

                // Показываем сообщение об успехе с анимацией
                formSuccess.style.display = 'block';
                formSuccess.style.opacity = '0';

                setTimeout(() => {
                    formSuccess.style.transition = 'opacity 0.5s ease';
                    formSuccess.style.opacity = '1';
                }, 10);

                // Скрываем сообщение об успехе через 8 секунд
                setTimeout(() => {
                    formSuccess.style.opacity = '0';
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 500);
                }, 8000);
            }
        });
    }

    // ===== Кнопка "Наверх" =====
    const backToTopBtn = document.querySelector('.back-to-top');

    // Показываем/скрываем кнопку "Наверх" в зависимости от положения скролла
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Плавный скролл наверх при клике на кнопку
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== Активная ссылка навигации =====
    // Получаем все секции с ID
    const sections = document.querySelectorAll('section[id]');

    // Добавляем обработчик события для скролла
    window.addEventListener('scroll', navHighlighter);

    function navHighlighter() {
        // Получаем текущую позицию скролла
        let scrollY = window.pageYOffset;

        // Проходим по всем секциям, чтобы получить высоту, верхнюю позицию и ID для каждой
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');

            // Если наша текущая позиция скролла находится в пределах текущей секции
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }

    // ===== Модальное окно для покупки билетов =====
    const modal = document.getElementById('ticketModal');
    const buyTicketButtons = document.querySelectorAll('.buy-ticket');
    const closeModal = document.querySelector('.close-modal');
    const ticketForm = document.getElementById('ticketForm');
    const ticketSuccess = document.getElementById('ticketSuccess');

    // Данные о ценах билетов
    const ticketPrices = {
        standard: 1,
        vip: 1.5,
        'fan-zone': 1.2
    };

    // Открываем модальное окно при клике на кнопку "Билеты"
    buyTicketButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Получаем данные о концерте из атрибутов кнопки
            const concert = button.getAttribute('data-concert');
            const date = button.getAttribute('data-date');
            const time = button.getAttribute('data-time');
            const price = button.getAttribute('data-price');
            const currency = button.getAttribute('data-currency') || 'р.';

            // Заполняем информацию о концерте в модальном окне
            document.querySelector('#concertVenue span').textContent = concert;
            document.querySelector('#concertDate span').textContent = date;
            document.querySelector('#concertTime span').textContent = time;
            document.querySelector('#ticketPrice span').textContent = `${price} ${currency}`;

            // Сохраняем базовую цену для расчетов
            document.querySelector('#ticketPrice').setAttribute('data-base-price', price);
            document.querySelector('#ticketPrice').setAttribute('data-currency', currency);

            // Сбрасываем форму и обновляем итоговую сумму
            ticketForm.reset();
            updateTotalAmount();

            // Скрываем сообщение об успешном заказе, если оно было показано ранее
            ticketSuccess.style.display = 'none';

            // Показываем модальное окно
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            // Блокируем скролл на основной странице
            document.body.style.overflow = 'hidden';
        });
    });

    // Закрываем модальное окно при клике на крестик
    closeModal.addEventListener('click', closeTicketModal);

    // Закрываем модальное окно при клике вне его содержимого
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTicketModal();
        }
    });

    // Функция закрытия модального окна
    function closeTicketModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            // Сбрасываем форму при закрытии
            ticketForm.style.display = 'block';
            ticketSuccess.style.display = 'none';
        }, 300);
    }

    // Обработка изменения количества билетов
    const quantityInput = document.getElementById('ticketQuantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    minusBtn.addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            updateTotalAmount();
        }
    });

    plusBtn.addEventListener('click', () => {
        if (quantityInput.value < 10) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateTotalAmount();
        }
    });

    // Обновляем итоговую сумму при изменении типа или количества билетов
    document.getElementById('ticketType').addEventListener('change', updateTotalAmount);
    quantityInput.addEventListener('change', updateTotalAmount);

    // Функция обновления итоговой суммы
    function updateTotalAmount() {
        const basePrice = parseFloat(document.querySelector('#ticketPrice').getAttribute('data-base-price'));
        const currency = document.querySelector('#ticketPrice').getAttribute('data-currency');
        const ticketType = document.getElementById('ticketType').value;
        const quantity = parseInt(document.getElementById('ticketQuantity').value);

        // Рассчитываем итоговую сумму
        const multiplier = ticketPrices[ticketType];
        const total = basePrice * multiplier * quantity;

        // Обновляем отображение итоговой суммы
        document.getElementById('totalAmount').textContent = `${total.toLocaleString()} ${currency}`;
    }

    // Маска для телефона
    const phoneInput = document.getElementById('buyerPhone');

    phoneInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        e.target.value = !x[2] ? x[1] : '+' + x[1] + ' (' + x[2] + ') ' + (x[3] ? x[3] + '-' + x[4] : (x[3] ? x[3] : '')) + (x[5] ? '-' + x[5] : '');
    });

    // Валидация формы заказа билетов
    ticketForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Сбрасываем предыдущие ошибки
        document.querySelectorAll('#ticketForm .form-group').forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        });

        // Получаем поля формы
        const name = document.getElementById('buyerName');
        const email = document.getElementById('buyerEmail');
        const phone = document.getElementById('buyerPhone');
        const agreeTerms = document.getElementById('agreeTerms');

        let isValid = true;

        // Валидируем имя
        if (name.value.trim() === '') {
            showTicketError(name, 'Пожалуйста, введите ваше имя');
            isValid = false;
        }

        // Валидируем email
        if (email.value.trim() === '') {
            showTicketError(email, 'Пожалуйста, введите ваш email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showTicketError(email, 'Пожалуйста, введите корректный email адрес');
            isValid = false;
        }

        // Валидируем телефон
        if (phone.value.trim() === '') {
            showTicketError(phone, 'Пожалуйста, введите ваш телефон');
            isValid = false;
        } else if (phone.value.replace(/\D/g, '').length < 11) {
            showTicketError(phone, 'Пожалуйста, введите корректный номер телефона');
            isValid = false;
        }

        // Проверяем согласие с условиями
        if (!agreeTerms.checked) {
            isValid = false;
            alert('Для продолжения необходимо согласиться с условиями покупки');
        }

        // Если форма валидна, отправляем её
        if (isValid) {
            ticketForm.style.display = 'none';
            ticketSuccess.style.display = 'block';

            // Закрываем модальное окно через 3 секунды
            setTimeout(() => {
                closeTicketModal();
                // Возвращаем форму в исходное состояние для следующего использования
                setTimeout(() => {
                    ticketForm.style.display = 'block';
                    ticketSuccess.style.display = 'none';
                }, 300);
            }, 3000);
        }
    });

    // Показываем сообщение об ошибке для поля формы заказа билетов
    function showTicketError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    }

    // ===== Слайдер фотогалереи =====
    const gallerySlider = document.querySelector('.gallery-slider');
    const sliderItems = document.querySelectorAll('.gallery-slider .slider-item');
    const prevBtn = document.querySelector('.gallery-slider-container .prev-btn');
    const nextBtn = document.querySelector('.gallery-slider-container .next-btn');
    const dots = document.querySelectorAll('.gallery-slider-container .dot');

    if (gallerySlider && sliderItems.length > 0) {
        let currentSlide = 0;

        // Функция для отображения текущего слайда
        function showSlide(index) {
            // Скрываем все слайды
            sliderItems.forEach((item, i) => {
                item.style.transform = `translateX(${(i - index) * 100}%)`;
                item.classList.remove('active');
            });

            // Показываем текущий слайд
            sliderItems[index].classList.add('active');

            // Обновляем активную точку
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        // Инициализация слайдера
        showSlide(currentSlide);

        // Переход к следующему слайду
        function nextSlide() {
            currentSlide = (currentSlide + 1) % sliderItems.length;
            showSlide(currentSlide);
        }

        // Переход к предыдущему слайду
        function prevSlide() {
            currentSlide = (currentSlide - 1 + sliderItems.length) % sliderItems.length;
            showSlide(currentSlide);
        }

        // Обработчики событий для кнопок
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Обработчики событий для точек
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentSlide = i;
                showSlide(currentSlide);
            });
        });
    }
});