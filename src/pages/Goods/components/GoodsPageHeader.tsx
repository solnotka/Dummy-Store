import { SearchOutlined } from '@ant-design/icons'
import { Input, Typography } from 'antd'
import { Panel } from './Panel'
import './GoodsPageHeader.css'

export type GoodsPageHeaderProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  onSubmitSearch: (value: string) => void
  onClearSearch: () => void
}

export function GoodsPageHeader({
  searchValue,
  onSearchChange,
  onSubmitSearch,
  onClearSearch,
}: GoodsPageHeaderProps) {
  return (
    <Panel className="goods-page-header-panel">
      <header className="goods-page-header">
        <div className="goods-page-header__sizer" aria-hidden />
        <Typography.Title level={4} className="goods-page-header__title">
          Товары
        </Typography.Title>
        <div className="goods-page-header__search-rail">
          <div className="goods-page-header__search-wrap">
            <Input
              className="goods-page-header__search"
              allowClear
              variant="filled"
              size="large"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              prefix={<SearchOutlined className="goods-page-header__search-icon" />}
              placeholder="Найти"
              onPressEnter={(e) => onSubmitSearch(e.currentTarget.value)}
              onClear={() => {
                onSearchChange('')
                onClearSearch()
              }}
            />
          </div>
        </div>
      </header>
    </Panel>
  )
}
