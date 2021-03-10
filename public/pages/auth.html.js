const html = `
<div class="auth">
    <div class="content">
        <div class="standalone-form">
            <div class="title">
                <div class="primary">Вход</div>
                <div class="secondary">Рады видеть вас снова!</div>
            </div>
            <div class="form">
                <form id="authForm" novalidate>
                    <div class="form-group" id="usernameGroup">
                        <label>ЛОГИН ИЛИ EMAIL<span class="error-text" id="usernameErrorText"></span></label>
                        <input name="username" type="text" class="form-control" id="usernameInput" required>
                    </div>
                    <div class="form-group" id="passwordGroup">
                        <label>ПАРОЛЬ<span class="error-text" id="passwordErrorText"></span></label>
                        <input name="password" type="password" class="form-control" required>
                        <!-- <div class="muted"><linkButton href="#">Забыли пароль?</linkButton> -->
                    </div>
                    <div class="form-group">
                        <input type="submit" class="btn" value="Войти">
                        <div class="muted">Нужен аккаунт? <linkButton href="/signup">Создать</linkButton></div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
`;

export async function source(element, app) {
    document.title = `${app.name} | Авторизация`;
    element.innerHTML = html;

    const response = await app.apiGet('/user');
    if (response.ok) {
        // authenticated => redirecting to profile
        app.goto('/user');
        return;
    }

    const usernameGroup = document.getElementById('usernameGroup');
    const usernameErrorText = document.getElementById('usernameErrorText');
    const passwordGroup = document.getElementById('passwordGroup');
    const passwordErrorText = document.getElementById('passwordErrorText');

    const authForm = document.getElementById('authForm');
    authForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        usernameGroup.classList.remove('error');
        usernameErrorText.innerHTML = '';
        passwordGroup.classList.remove('error');
        passwordErrorText.innerHTML = '';

        const formData = new FormData(authForm);
        // both KoroLion and KoroLion@liokor.ru are correct usernames
        const username = formData.get('username').toLowerCase().replace('@liokor.ru', '');
        const password = formData.get('password');

        if (!username) {
            usernameGroup.classList.add('error');
            usernameErrorText.innerHTML = 'Логин не может быть пустым';
            return;
        }
        if (!password) {
            passwordGroup.classList.add('error');
            passwordErrorText.innerHTML = 'Пароль не может быть пустым';
            return;
        }

        const response = await app.apiPost('/user/auth', { username, password });
        if (response.ok) {
            app.goto('/user');
            return;
        }

        usernameGroup.classList.add('error');
        usernameErrorText.innerText = 'Неправильный логин или пароль';
        passwordGroup.classList.add('error');
        passwordErrorText.innerText = 'Неправильный логин или пароль';
    });
}
