// Конфигурация (заменить на реальный URL API Gateway)
const API_BASE_URL = 'https://ваш-api-gateway.apigw.yandexcloud.net';

// Глобальное состояние
let sessionToken = null;

// Активация промокода
async function activatePromo() {
    const code = document.getElementById('promoCode').value.trim();
    if (!code) return;

    showLoading(true);
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code })
        });

        const data = await response.json();

        if (data.status === 'success') {
            sessionToken = data.session_token;
            localStorage.setItem('risk_sentry_token', sessionToken);
            // Переход на страницу анализа
            window.location.href = 'analyze.html';
        } else {
            showError(data.reason || 'Неверный или использованный промокод');
        }
    } catch (err) {
        showError('Ошибка сети. Проверьте подключение.');
    } finally {
        showLoading(false);
    }
}

// Вспомогательные функции
function showLoading(show) {
    document.getElementById('promo-section').classList.toggle('d-none', show);
    document.getElementById('loading-section').classList.toggle('d-none', !show);
}

function showError(message) {
    const el = document.getElementById('error-section');
    el.textContent = message;
    el.classList.remove('d-none');
}

function hideError() {
    document.getElementById('error-section').classList.add('d-none');
}

// При загрузке страницы проверяем, может уже активирован?
if (localStorage.getItem('risk_sentry_token')) {
    window.location.href = 'analyze.html';
}
