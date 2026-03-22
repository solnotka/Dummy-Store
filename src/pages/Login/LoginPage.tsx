import { CloseOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Checkbox, ConfigProvider, Divider, Form, Input } from 'antd'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearAuthError, loginUser } from '../../store/slices/userSlice'
import { loginFormSchema, type LoginFormInput, type LoginFormValues } from './loginSchema'
import { loginPageAntdTheme } from '../../theme/antdTheme'
import { LoginPanel } from './LoginPanel'
import startIconUrl from './StartIcon.svg'
import './LoginPage.css'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error: authError } = useAppSelector((s) => s.user)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput, unknown, LoginFormValues>({
    resolver: zodResolver(loginFormSchema) as Resolver<
      LoginFormInput,
      unknown,
      LoginFormValues
    >,
    defaultValues: {
      login: 'emilys',
      password: 'emilyspass',
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(clearAuthError())
    const result = await dispatch(
      loginUser({
        username: data.login,
        password: data.password,
        remember: data.remember,
      }),
    )
    if (loginUser.fulfilled.match(result)) {
      navigate('/goods', { replace: true })
    }
  }

  const loading = status === 'loading'

  return (
    <ConfigProvider theme={loginPageAntdTheme}>
      <div className="login-page">
        <LoginPanel>
          <div className="login-page__logo" aria-hidden>
            <img src={startIconUrl} alt="logo" width={52} height={52} decoding="async" />
          </div>

          <h1 className="login-page__title">Добро пожаловать!</h1>
          <p className="login-page__subtitle">Пожалуйста, авторизируйтесь</p>

          <Form
            className="login-page__form"
            layout="vertical"
            size="large"
            requiredMark={false}
            onFinish={handleSubmit(onSubmit)}
          >
            {authError ? (
              <Alert
                type="error"
                title={authError}
                showIcon
                closable={{
                  onClose: () => dispatch(clearAuthError()),
                }}
                style={{ marginBottom: 16 }}
              />
            ) : null}

            <Form.Item
              label="Логин"
              validateStatus={errors.login ? 'error' : undefined}
              help={errors.login?.message}
              required
            >
              <Controller
                name="login"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<UserOutlined />}
                    allowClear={{ clearIcon: <CloseOutlined /> }}
                    placeholder="Логин"
                    autoComplete="username"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              className="login-page__field-password"
              label="Пароль"
              validateStatus={errors.password ? 'error' : undefined}
              help={errors.password?.message}
              required
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined />}
                    placeholder="Пароль"
                    autoComplete="current-password"
                  />
                )}
              />
            </Form.Item>

            <Form.Item className="login-page__remember">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                    Запомнить данные
                  </Checkbox>
                )}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="login-page__submit"
                loading={loading}
              >
                Войти
              </Button>
            </Form.Item>
          </Form>

          <Divider className="login-page__divider">или</Divider>

          <p className="login-page__footer">
            Нет аккаунта?{' '}
            <a href="#create">Создать</a>
          </p>
        </LoginPanel>
      </div>
    </ConfigProvider>
  )
}
