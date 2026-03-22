import { PlusCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Progress, Space, Table, Typography } from 'antd'
import type { TableProps } from 'antd'
import type { Key } from 'react'
import type { Product } from '../models/types'
import { goodsPageTablePaginationLayout } from '../../../theme/antdTheme'
import { goodsColumns } from './columns'
import { Panel } from './Panel'
import './GoodsPageContent.css'

export type GoodsPageContentProps = {
  loading: boolean
  loadPercent: number
  dataSource: Product[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
  selectedRowKeys: Key[]
  onSelectionChange: (keys: Key[]) => void
  tableResetKey: number
  onResetFilters: () => void
  onAddClick: () => void
}

export function GoodsPageContent({
  loading,
  loadPercent,
  dataSource,
  total,
  page,
  pageSize,
  onPageChange,
  selectedRowKeys,
  onSelectionChange,
  tableResetKey,
  onResetFilters,
  onAddClick,
}: GoodsPageContentProps) {
  const rowSelection: TableProps<Product>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => onSelectionChange(keys as Key[]),
  }

  return (
    <Panel className="goods-page-content-panel">
      {loading ? (
        <div
          className="goods-page-content__loading"
          role="status"
          aria-busy="true"
          aria-label="Загрузка данных"
        >
          <div className="goods-page-content__loading-bar">
            <Progress
              type="line"
              percent={loadPercent}
              status="active"
              showInfo={false}
              strokeLinecap="round"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="goods-page-content__head">
            <div className="goods-page-content__toolbar">
              <Typography.Text className="goods-page-content__toolbar-title">
                Все позиции
              </Typography.Text>
              <Space size={8}>
                <Button
                  type="default"
                  className="goods-page-content__sync-btn"
                  icon={<SyncOutlined />}
                  onClick={onResetFilters}
                  aria-label="Сбросить фильтры и сортировку"
                />
                <Button
                  type="primary"
                  className="goods-page-content__add-btn"
                  icon={<PlusCircleOutlined />}
                  onClick={onAddClick}
                >
                  Добавить
                </Button>
              </Space>
            </div>
          </div>
          <Table<Product>
            key={tableResetKey}
            className="goods-page-content__table"
            rowKey="id"
            columns={goodsColumns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            pagination={{
              ...goodsPageTablePaginationLayout,
              current: page,
              pageSize,
              total,
              showSizeChanger: false,
              showTotal: (t, range) => (
                <span className="goods-page-content__pagination-summary">
                  <span className="goods-page-content__pagination-summary-muted">
                    Показано{' '}
                  </span>
                  <span className="goods-page-content__pagination-summary-strong">
                    {t === 0 ? '0' : `${range[0]}-${range[1]}`}
                  </span>
                  <span className="goods-page-content__pagination-summary-muted">
                    {' '}
                    из{' '}
                  </span>
                  <span className="goods-page-content__pagination-summary-strong">
                    {t}
                  </span>
                </span>
              ),
              onChange: onPageChange,
            }}
            scroll={{ x: 1000 }}
          />
        </>
      )}
    </Panel>
  )
}
