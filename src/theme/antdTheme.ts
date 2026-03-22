import type { TablePaginationConfig, ThemeConfig } from 'antd'

export const loginPageAntdTheme: ThemeConfig = {
  token: {
    fontFamily:
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    controlHeightLG: 44,
    borderRadiusLG: 12,
    fontSizeLG: 18,
    lineHeightLG: 1.2,
    colorPrimary: '#242EDB',
    colorPrimaryHover: '#2d38ed',
    colorPrimaryActive: '#1f26c4',
  },
  components: {
    Button: {
      primaryShadow: 'none',
      fontWeight: 600,
      contentFontSizeLG: 18,
      primaryColor: '#ffffff',
    },
  },
}

export const goodsPageTablePaginationLayout: Pick<
  TablePaginationConfig,
  'placement' | 'className'
> = {
  placement: ['bottomStart'],
  className: 'goods-page-content__pagination',
}

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#242EDB',
    controlInteractiveSize: 24,
    borderRadius: 8,
    fontFamily:
      "'Cairo', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSizeHeading4: 24,
    lineHeightHeading4: 1.2,
    fontWeightStrong: 700,
  },
  components: {
    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 0,
    },
    /** Поле поиска на странице товаров: `variant="filled"`, `size="large"` */
    Input: {
      colorFillTertiary: '#F3F3F3',
      colorFillSecondary: '#EBEBEB',
      activeBg: '#F3F3F3',
      borderRadiusLG: 8,
      /** Типографика large: 14px / line-height 24px (как в макете) */
      inputFontSizeLG: 14,
      lineHeightLG: 24 / 14,
    },
  },
}
