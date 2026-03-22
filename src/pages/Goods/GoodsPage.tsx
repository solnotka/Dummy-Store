import { message } from 'antd'
import { useCallback, useEffect, useState, type Key } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { clearData, fetchData, filterData } from '../../store/slices/goodsSlice'
import { AddProductModal } from './components/AddProductModal'
import { GoodsPageContent } from './components/GoodsPageContent'
import { GoodsPageHeader } from './components/GoodsPageHeader'
import './GoodsPage.css'

export function GoodsPage() {
  const dispatch = useAppDispatch()
  const { allData, status } = useAppSelector((s) => s.goods)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [loadPercent, setLoadPercent] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [tableResetKey, setTableResetKey] = useState(0)
  const [addProductOpen, setAddProductOpen] = useState(false)

  const runQuery = useCallback(
    (raw: string) => {
      const q = raw.trim()
      const run = q
        ? dispatch(filterData({ q })).unwrap()
        : dispatch(fetchData()).unwrap()
      return run.catch(() => message.error('Не удалось получить данные'))
    },
    [dispatch],
  )

  const handleResetFiltersAndSort = useCallback(() => {
    setSearchValue('')
    setPage(1)
    setSelectedRowKeys([])
    setTableResetKey((k) => k + 1)
    dispatch(fetchData())
      .unwrap()
      .catch(() => message.error('Не удалось сбросить фильтры'))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchData())
      .unwrap()
      .catch(() => message.error('Не удалось загрузить товары'))

    return () => {
      dispatch(clearData())
    }
  }, [dispatch])

  useEffect(() => {
    setPage(1)
    setSelectedRowKeys([])
  }, [allData])

  useEffect(() => {
    setSelectedRowKeys([])
  }, [page, pageSize])

  const loading = status === 'loading'
  const dataSource = allData ?? []
  const total = dataSource.length

  useEffect(() => {
    if (!loading) {
      setLoadPercent(0)
      return
    }

    setLoadPercent(0)
    const timer = window.setInterval(() => {
      setLoadPercent((p) => (p >= 95 ? 95 : p + 1))
    }, 100)

    return () => window.clearInterval(timer)
  }, [loading])

  return (
    <div className="goods-page">
      <div className="goods-page__container">
        <GoodsPageHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSubmitSearch={(value) => runQuery(value)}
          onClearSearch={() => runQuery('')}
        />
        <GoodsPageContent
          loading={loading}
          loadPercent={loadPercent}
          dataSource={dataSource}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(p, ps) => {
            setPage(p)
            setPageSize(ps)
          }}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          tableResetKey={tableResetKey}
          onResetFilters={handleResetFiltersAndSort}
          onAddClick={() => setAddProductOpen(true)}
        />
      </div>
      <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} />
    </div>
  )
}
