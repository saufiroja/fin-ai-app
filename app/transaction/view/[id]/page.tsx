'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { categories } from '@/dummy/categories';
import { parseDate, CalendarDate } from '@internationalized/date';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Tag,
  MapPin,
  FileText,
  CreditCard,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Copy,
  Share2,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Loading from './loading';
import Error from './error';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: string;
  category: string;
  description: string;
  date: CalendarDate;
  paymentMethod: string;
  recipient: string;
  tags: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock function to get transaction by ID
const getTransactionById = (id: string): Transaction | null => {
  // In a real app, this would fetch from your API
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'expense',
      amount: '25000',
      category: 'Food',
      description:
        'Lunch at restaurant with colleagues. Great seafood and service.',
      date: parseDate('2025-06-25'),
      paymentMethod: 'cash',
      recipient: 'Restaurant ABC',
      tags: 'lunch, restaurant, colleagues',
      createdAt: '2025-06-25T12:30:00Z',
      updatedAt: '2025-06-25T12:30:00Z',
    },
    {
      id: '2',
      type: 'income',
      amount: '5000000',
      category: 'Salary',
      description: 'Monthly salary for June 2025',
      date: parseDate('2025-06-01'),
      paymentMethod: 'bank_transfer',
      recipient: 'Company XYZ',
      tags: 'salary, monthly, income',
      createdAt: '2025-06-01T09:00:00Z',
      updatedAt: '2025-06-01T09:00:00Z',
    },
    {
      id: '3',
      type: 'expense',
      amount: '150000',
      category: 'Transportation',
      description: 'Monthly public transport pass',
      date: parseDate('2025-06-20'),
      paymentMethod: 'e_wallet',
      recipient: 'TransJakarta',
      tags: 'transport, monthly, commute',
      createdAt: '2025-06-20T08:15:00Z',
      updatedAt: '2025-06-20T08:15:00Z',
    },
  ];

  return mockTransactions.find((t) => t.id === id) || null;
};

const getPaymentMethodDisplay = (method: string) => {
  const methods: Record<
    string,
    { label: string; icon: string; color: string }
  > = {
    cash: { label: 'Cash', icon: '💵', color: 'success' },
    debit: { label: 'Debit Card', icon: '💳', color: 'primary' },
    credit: { label: 'Credit Card', icon: '🏦', color: 'secondary' },
    bank_transfer: { label: 'Bank Transfer', icon: '🏛️', color: 'warning' },
    e_wallet: { label: 'E-Wallet', icon: '📱', color: 'danger' },
  };
  return methods[method] || { label: method, icon: '💰', color: 'default' };
};

const getCategoryInfo = (categoryName: string) => {
  return (
    categories.find((cat) => cat.name === categoryName) || {
      name: categoryName,
      icon: '📝',
      color: '#6B7280',
      description: 'Other category',
    }
  );
};

export default function TransactionViewPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  // Load transaction data on component mount
  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const data = getTransactionById(transactionId);
        if (data) {
          setTransaction(data);
        } else {
          setError('Transaction not found');
        }
      } catch (err) {
        setError('Failed to load transaction');
        console.error('Error loading transaction:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (transactionId) {
      loadTransaction();
    }
  }, [transactionId]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(transactionId);
    // You could add a toast notification here
  };

  const handleEdit = () => {
    router.push(`/transaction/update/${transactionId}`);
  };

  const handleDelete = () => {
    // You could add a confirmation modal here
    console.log('Delete transaction:', transactionId);
  };

  // Loading state - use the same skeleton as loading.tsx
  if (isLoading) {
    return <Loading />;
  }

  // Error state
  if (error || !transaction) {
    return (
      <Error
        error={
          {
            message: error || 'Transaction not found',
            name: 'TransactionError',
          } as Error
        }
        reset={() => {
          setError(null);
          setTransaction(null);
        }}
      />
    );
  }

  const categoryInfo = getCategoryInfo(transaction.category);
  const paymentInfo = getPaymentMethodDisplay(transaction.paymentMethod);
  const tagsList = transaction.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return (
    <div className='p-6 dark:from-gray-900 dark:to-gray-800'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <Button
              isIconOnly
              variant='light'
              onPress={() => router.push('/transaction')}
              className='text-gray-600 hover:text-gray-800'
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
                Transaction Details
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                View transaction information
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2'>
            <Button
              variant='light'
              startContent={<Share2 size={18} />}
              className='text-gray-600'
            >
              Share
            </Button>
            <Button
              variant='light'
              startContent={<Edit3 size={18} />}
              onPress={handleEdit}
              className='text-blue-600 hover:text-blue-800'
            >
              Edit
            </Button>
            <Button
              variant='light'
              startContent={<Trash2 size={18} />}
              onPress={handleDelete}
              className='text-red-600 hover:text-red-800'
            >
              Delete
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Transaction Info */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Overview Card */}
            <Card className='shadow-lg'>
              <CardHeader className='pb-4'>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`p-3 rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className='text-green-600' size={24} />
                      ) : (
                        <TrendingDown className='text-red-600' size={24} />
                      )}
                    </div>
                    <div>
                      <h2 className='text-xl font-semibold'>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </h2>
                      <p className='text-gray-600 dark:text-gray-400'>
                        {transaction.date.toString()}
                      </p>
                    </div>
                  </div>
                  <Chip
                    color={transaction.type === 'income' ? 'success' : 'danger'}
                    variant='flat'
                    size='lg'
                  >
                    {transaction.type.toUpperCase()}
                  </Chip>
                </div>
              </CardHeader>

              <CardBody className='space-y-4'>
                {/* Amount */}
                <div className='text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                    Amount
                  </p>
                  <p
                    className={`text-4xl font-bold ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}Rp{' '}
                    {parseFloat(transaction.amount).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Category */}
                <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <span className='text-2xl'>{categoryInfo.icon}</span>
                  <div className='flex-1'>
                    <p className='font-semibold'>{categoryInfo.name}</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {categoryInfo.description}
                    </p>
                  </div>
                  <Chip
                    size='sm'
                    style={{
                      backgroundColor: categoryInfo.color,
                      color: 'white',
                    }}
                  >
                    Category
                  </Chip>
                </div>

                {/* Payment Method */}
                <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                  <span className='text-2xl'>{paymentInfo.icon}</span>
                  <div className='flex-1'>
                    <p className='font-semibold'>{paymentInfo.label}</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Payment method used
                    </p>
                  </div>
                  <Chip color={paymentInfo.color as any} size='sm'>
                    {paymentInfo.label}
                  </Chip>
                </div>
              </CardBody>
            </Card>

            {/* Details Card */}
            <Card className='shadow-lg'>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <FileText className='text-blue-500' size={20} />
                  <h3 className='text-lg font-semibold'>Transaction Details</h3>
                </div>
              </CardHeader>

              <CardBody className='space-y-4'>
                {/* Recipient/Payer */}
                {transaction.recipient && (
                  <div className='flex items-start gap-3'>
                    <MapPin className='text-gray-400 mt-1' size={16} />
                    <div className='flex-1'>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {transaction.type === 'income'
                          ? 'From (Payer)'
                          : 'To (Recipient)'}
                      </p>
                      <p className='font-medium'>{transaction.recipient}</p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {transaction.description && (
                  <div className='flex items-start gap-3'>
                    <FileText className='text-gray-400 mt-1' size={16} />
                    <div className='flex-1'>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Description
                      </p>
                      <p className='font-medium'>{transaction.description}</p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tagsList.length > 0 && (
                  <div className='flex items-start gap-3'>
                    <Tag className='text-gray-400 mt-1' size={16} />
                    <div className='flex-1'>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                        Tags
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {tagsList.map((tag, index) => (
                          <Chip
                            key={index}
                            size='sm'
                            variant='flat'
                            color='primary'
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Transaction ID */}
            <Card className='shadow-lg'>
              <CardHeader>
                <h3 className='text-lg font-semibold'>Transaction ID</h3>
              </CardHeader>
              <CardBody>
                <div className='flex items-center gap-2'>
                  <code className='bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm flex-1'>
                    {transaction.id}
                  </code>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    onPress={handleCopyId}
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Timestamps */}
            <Card className='shadow-lg'>
              <CardHeader>
                <h3 className='text-lg font-semibold'>Timeline</h3>
              </CardHeader>
              <CardBody className='space-y-3'>
                {transaction.createdAt && (
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Created
                    </p>
                    <p className='font-medium text-sm'>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {transaction.updatedAt && (
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Last Updated
                    </p>
                    <p className='font-medium text-sm'>
                      {new Date(transaction.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Transaction Date
                  </p>
                  <p className='font-medium text-sm'>
                    {transaction.date.toString()}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card className='shadow-lg'>
              <CardHeader>
                <h3 className='text-lg font-semibold'>Quick Actions</h3>
              </CardHeader>
              <CardBody className='space-y-2'>
                <Button
                  className='w-full justify-start'
                  variant='light'
                  startContent={<Edit3 size={16} />}
                  onPress={handleEdit}
                >
                  Edit Transaction
                </Button>
                <Button
                  className='w-full justify-start'
                  variant='light'
                  startContent={<Copy size={16} />}
                  onPress={() => {
                    // Duplicate transaction functionality
                    router.push(`/transaction/add?duplicate=${transaction.id}`);
                  }}
                >
                  Duplicate
                </Button>
                <Divider />
                <Button
                  className='w-full justify-start text-red-600'
                  variant='light'
                  startContent={<Trash2 size={16} />}
                  onPress={handleDelete}
                >
                  Delete Transaction
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
