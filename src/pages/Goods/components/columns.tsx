import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { Button, Image, Space } from 'antd'
import type { Product } from '../models/types'
import {
  LOW_RATING_THRESHOLD,
  formatCategoryLabel,
  formatRubParts,
} from '../utils'

function strCompare(a: string | undefined, b: string | undefined) {
  return (a ?? '').localeCompare(b ?? '', undefined, { sensitivity: 'base' })
}

export const goodsColumns: TableProps<Product>['columns'] = [
  {
    title: 'Наименование',
    dataIndex: 'title',
    key: 'name',
    width: 320,
    align: 'left',
    sorter: (a, b) => strCompare(a.title, b.title),
    render: (_: unknown, record: Product) => (
      <div className="goods-table__name-cell">
        <Image
          src={record.thumbnail}
          alt=""
          width={48}
          height={48}
          preview={false}
        />
        <div className="goods-table__name-text">
          <div className="goods-table__name-title">{record.title}</div>
          <div className="goods-table__name-category">
            {formatCategoryLabel(record.category)}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Вендор',
    dataIndex: 'brand',
    key: 'brand',
    width: 140,
    align: 'center',
    sorter: (a, b) => strCompare(a.brand, b.brand),
    render: (brand: string | undefined) => (
      <span className="goods-table__vendor">{brand ?? '—'}</span>
    ),
  },
  {
    title: 'Артикул',
    dataIndex: 'sku',
    key: 'sku',
    width: 140,
    align: 'center',
    sorter: (a, b) => strCompare(a.sku, b.sku),
    render: (sku: string | undefined) => (
      <span className="goods-table__sku">{sku ?? '—'}</span>
    ),
  },
  {
    title: 'Оценка',
    dataIndex: 'rating',
    key: 'rating',
    width: 100,
    align: 'center',
    sorter: (a, b) => a.rating - b.rating,
    render: (rating: number) => (
      <span className="goods-table__rating">
        <span
          className={
            rating < LOW_RATING_THRESHOLD
              ? 'goods-table__rating-value goods-table__rating-value--low'
              : 'goods-table__rating-value'
          }
        >
          {rating.toFixed(1)}
        </span>
        <span className="goods-table__rating-suffix">/5</span>
      </span>
    ),
  },
  {
    title: 'Цена, ₽',
    dataIndex: 'price',
    key: 'price',
    width: 130,
    align: 'center',
    sorter: (a, b) => a.price - b.price,
    render: (price: number) => {
      const [intPart, fracPart] = formatRubParts(price)
      return (
        <span className="goods-table__price">
          <span className="goods-table__price-int">{intPart}</span>
          {fracPart ? (
            <span className="goods-table__price-frac">{fracPart}</span>
          ) : null}
        </span>
      )
    },
  },
  {
    title: '',
    key: 'actions',
    width: 120,
    align: 'center',
    fixed: 'right',
    render: () => (
      <Space size={32}>
        <Button
          type="primary"
          className="goods-table__action-primary"
          icon={<PlusOutlined />}
          size="small"
        />
        <Button
          type="default"
          className="goods-table__action-more"
          icon={<EllipsisOutlined />}
          shape="circle"
          size="small"
        />
      </Space>
    ),
  },
]
