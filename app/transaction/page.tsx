'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table';
import { Chip } from '@heroui/chip';
import { Tooltip } from '@heroui/tooltip';
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Edit3,
  Trash2,
  Download,
  Eye,
  Calendar,
} from 'lucide-react';
import { dummyResponseHistory, dummyResponseHistory2 } from '@/dummy/history';
import { categories } from '@/dummy/categories';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import StatisticsCard from '@/components/StatisticsCard';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Calendar as HeroCalendar, RangeCalendar } from '@heroui/calendar';
import { Tabs, Tab } from '@heroui/tabs';
import { Select, SelectItem } from '@heroui/select';
import { today, getLocalTimeZone } from '@internationalized/date';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import {
  Pagination,
  PaginationItem,
  PaginationCursor,
} from '@heroui/pagination';

// Mock data to simulate your existing data structure
const dummyCategories = [
  { name: 'All Categories', icon: '📂' },
  { name: 'Food', icon: '🍔' },
  { name: 'Salary', icon: '💰' },
  { name: 'Transportation', icon: '🚗' },
  { name: 'Utilities', icon: '💡' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Entertainment', icon: '🎬' },
];

interface Transaction {
  id: number;
  type: string;
  desc: string;
  category: string;
  amount: number;
  date: string;
}

const allTransactions = [
  ...dummyResponseHistory.data,
  ...dummyResponseHistory2.data,
];

export default function TransactionPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [isMobile, setIsMobile] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: any; end: any } | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const pageSize = viewMode === 'card' || isMobile ? 12 : 10;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setViewMode('card');
  }, [isMobile]);

  const filteredTransactions = useMemo(() => {
    let txs = allTransactions;
    if (dateRange && dateRange.start && dateRange.end) {
      const start = dateRange.start.toDate(getLocalTimeZone());
      const end = dateRange.end.toDate(getLocalTimeZone());
      txs = txs.filter((t: Transaction) => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });
    } // else do not filter by date, show all
    if (category) txs = txs.filter((t: Transaction) => t.category === category);
    if (search)
      txs = txs.filter((t: Transaction) =>
        t.desc.toLowerCase().includes(search.toLowerCase()),
      );
    return txs;
  }, [search, category, dateRange]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'Pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'Pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    return cat?.icon || '📄';
  };

  const paginatedTransactions = useMemo(() => {
    const startIdx = (page - 1) * pageSize;
    return filteredTransactions.slice(startIdx, startIdx + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const paginatedCardTransactions = paginatedTransactions; // always use the same slice

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  return (
    <div className='min-h-screen w-full'>
      <div className='max-w-7xl mx-auto p-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                Transaction Management
              </h1>
            </div>
            <div className='flex gap-3'>
              <Button className='flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'>
                <Download className='w-4 h-4' />
                Export
              </Button>
              <Button className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'>
                <Plus className='w-4 h-4' />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <StatisticsCard
              icon={<TrendingDown className='w-6 h-6 text-red-600' />}
              label='Total Pengeluaran'
              value={formatCurrency(totalExpense)}
              valueColor='text-red-500'
              iconBg='bg-red-100 dark:bg-red-900'
            />
            <StatisticsCard
              icon={<TrendingUp className='w-6 h-6 text-green-600' />}
              label='Total Pemasukan'
              value={formatCurrency(totalIncome)}
              valueColor='text-green-500'
              iconBg='bg-green-100 dark:bg-green-900'
            />
            <StatisticsCard
              icon={
                <div
                  className={`w-6 h-6 rounded-full ${balance >= 0 ? 'bg-blue-600' : 'bg-orange-600'}`}
                />
              }
              label='Sisa Budget'
              value={formatCurrency(balance)}
              valueColor={balance >= 0 ? 'text-blue-500' : 'text-orange-500'}
              iconBg={
                balance >= 0
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-orange-100 dark:bg-orange-900'
              }
            />
          </div>
        </div>

        {/* Filters Section */}
        <Card className='mb-8'>
          <CardBody>
            <div className='flex flex-col lg:flex-row gap-4'>
              <div className='flex gap-4 flex-1'>
                <Input
                  isClearable
                  startContent={<Search className='text-gray-400 w-5 h-5' />}
                  type='text'
                  placeholder='Search transactions...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  classNames={{
                    label: 'text-black/50 dark:text-white/90',
                    input: [
                      'bg-transparent',
                      'text-black/90 dark:text-white/90',
                      'placeholder:text-default-700/50 dark:placeholder:text-white/60',
                    ],
                    innerWrapper: 'bg-transparent',
                    inputWrapper: [
                      'bg-default-200/50',
                      'dark:bg-default/60',
                      'backdrop-blur-xl',
                      'backdrop-saturate-200',
                      'hover:bg-default-200/70',
                      'dark:hover:bg-default/70',
                      'group-data-[focus=true]:bg-default-200/50',
                      'dark:group-data-[focus=true]:bg-default/60',
                      '!cursor-text',
                    ],
                  }}
                />
              </div>
              <div className='flex gap-4 flex-1'>
                <Select
                  label='Category'
                  selectedKeys={category ? [category] : []}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    setCategory(val === 'All Categories' ? '' : val || '');
                  }}
                  className='min-w-[180px]'
                >
                  {dummyCategories.map((cat) => (
                    <SelectItem key={cat.name} textValue={cat.name}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </Select>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant='bordered'
                      className='flex items-center gap-2 min-w-[180px] h-[44px] px-4 py-2 border rounded-xl shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-white hover:border-gray-300 transition-colors duration-200'
                    >
                      <Calendar className='w-5 h-5 text-gray-400' />
                      {dateRange && dateRange.start && dateRange.end
                        ? `${dateRange.start.toDate(getLocalTimeZone()).toLocaleDateString('id-ID')} - ${dateRange.end.toDate(getLocalTimeZone()).toLocaleDateString('id-ID')}`
                        : 'Semua Tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='p-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg'>
                    <RangeCalendar
                      aria-label='Date Range (Controlled)'
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </PopoverContent>
                </Popover>
                {!isMobile && (
                  <Tabs
                    selectedKey={viewMode}
                    onSelectionChange={(key) =>
                      setViewMode(key as 'table' | 'card')
                    }
                    className='min-w-[180px]'
                  >
                    <Tab key='table' title='Table' />
                    <Tab key='card' title='Cards' />
                  </Tabs>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Transactions Display */}
        {viewMode === 'table' && !isMobile ? (
          <>
            <div className='rounded-2xl overflow-hidden'>
              <div className='overflow-x-auto'>
                <Table
                  aria-label='Daftar Transaksi'
                  bottomContent={
                    // Pagination controls
                    <div className='flex justify-center items-center p-4'>
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        total={totalPages}
                        page={page}
                        onChange={setPage}
                        className='flex items-center gap-2'
                        size='md'
                      />
                    </div>
                  }
                >
                  <TableHeader>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Description</TableColumn>
                    <TableColumn>Category</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={'No transactions found.'}>
                    {paginatedTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className='text-foreground'>
                          {formatDate(tx.date)}
                        </TableCell>
                        <TableCell className='text-foreground'>
                          {tx.desc}
                        </TableCell>
                        <TableCell>
                          <Chip
                            color='primary'
                            variant='flat'
                            startContent={
                              <span>{getCategoryIcon(tx.category)}</span>
                            }
                          >
                            {tx.category}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              tx.type === 'Pemasukan'
                                ? 'text-green-600 dark:text-green-400 font-semibold'
                                : 'text-red-500 dark:text-red-400 font-semibold'
                            }
                          >
                            {tx.type === 'Pemasukan' ? '+' : '-'}
                            {formatCurrency(tx.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={
                              tx.type === 'Pemasukan' ? 'success' : 'danger'
                            }
                            variant='flat'
                          >
                            {tx.type}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className='flex gap-2'>
                            <Tooltip content='View'>
                              <button className='p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-150'>
                                <Eye className='w-4 h-4' />
                              </button>
                            </Tooltip>
                            <Tooltip content='Edit'>
                              <button className='p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors duration-150'>
                                <Edit3 className='w-4 h-4' />
                              </button>
                            </Tooltip>
                            <Tooltip content='Delete'>
                              <button className='p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-150'>
                                <Trash2 className='w-4 h-4' />
                              </button>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {paginatedCardTransactions.map((tx) => (
                <Card
                  key={tx.id}
                  className='hover:shadow-xl transition-all duration-300 hover:scale-105'
                >
                  <CardHeader className='flex items-start justify-between mb-2 pb-0'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-lg'>
                        {getCategoryIcon(tx.category)}
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                          {tx.desc}
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <Chip
                      color={tx.type === 'Pemasukan' ? 'success' : 'danger'}
                      variant='flat'
                    >
                      {tx.type}
                    </Chip>
                  </CardHeader>
                  <CardBody className='mb-2'>
                    <Chip
                      color='primary'
                      variant='flat'
                      startContent={<span>{getCategoryIcon(tx.category)}</span>}
                    >
                      {tx.category}
                    </Chip>
                  </CardBody>
                  <CardFooter className='flex items-center justify-between pt-0'>
                    <span
                      className={`text-xl font-bold ${tx.type === 'Pemasukan' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                      {tx.type === 'Pemasukan' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                    <div className='flex gap-1'>
                      <Tooltip content='View'>
                        <button className='p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-150'>
                          <Eye className='w-4 h-4' />
                        </button>
                      </Tooltip>
                      <Tooltip content='Edit'>
                        <button className='p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors duration-150'>
                          <Edit3 className='w-4 h-4' />
                        </button>
                      </Tooltip>
                      <Tooltip content='Delete'>
                        <button className='p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-150'>
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </Tooltip>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className='flex justify-center mt-6'>
              <Pagination
                isCompact
                showControls
                showShadow
                total={totalPages}
                page={page}
                onChange={setPage}
                className='flex items-center gap-2'
                size='md'
              />
            </div>
          </>
        )}

        {filteredTransactions.length === 0 && (
          <div className='bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Search className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              No transactions found
            </h3>
            <p className='text-gray-500'>
              Try adjusting your search criteria or date range.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
