'use client';
import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Progress } from '@heroui/progress';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Calendar,
  DollarSign,
} from 'lucide-react';

export default function InsightsPage() {
  const insights = [
    {
      id: 1,
      type: 'analysis',
      title: 'Analisis Pengeluaran Minggu Ini',
      icon: <TrendingUp className='w-5 h-5' />,
      iconColor: 'bg-blue-500',
      content:
        'Pengeluaran Anda minggu ini naik 15% dibanding minggu lalu (Rp 425.000 vs Rp 370.000). Peningkatan terbesar ada pada kategori Makanan & Minuman. Disarankan untuk lebih sering masak di rumah untuk 3 hari ke depan.',
      trend: 'up',
      percentage: '15%',
      amount: 'Rp 425.000',
      category: 'Makanan & Minuman',
    },
    {
      id: 2,
      type: 'target',
      title: 'Target Tabungan Bulan Ini',
      icon: <Target className='w-5 h-5' />,
      iconColor: 'bg-green-500',
      content:
        'Selamat! Anda sudah mencapai 78% dari target tabungan bulan ini (Rp 1.560.000 dari Rp 2.000.000). Dengan pola pengeluaran saat ini, Anda akan melampaui target sebesar 12% di akhir bulan.',
      progress: 78,
      currentAmount: 'Rp 1.560.000',
      targetAmount: 'Rp 2.000.000',
      projectedExcess: '12%',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Alert: Budget Entertainment',
      icon: <AlertTriangle className='w-5 h-5' />,
      iconColor: 'bg-orange-500',
      content:
        'Budget entertainment Anda sudah terpakai 85% (Rp 340.000 dari Rp 400.000) padahal masih ada 12 hari lagi. Pertimbangkan aktivitas free/murah seperti jogging di taman atau nonton film di rumah.',
      progress: 85,
      usedAmount: 'Rp 340.000',
      totalBudget: 'Rp 400.000',
      daysLeft: 12,
      status: 'warning',
    },
    {
      id: 4,
      type: 'recommendation',
      title: 'Smart Recommendation',
      icon: <Lightbulb className='w-5 h-5' />,
      iconColor: 'bg-yellow-500',
      content:
        'Berdasarkan pola belanja Anda, ada promo di Superindo untuk produk yang sering Anda beli: Susu Ultra (diskon 20%), Telur (buy 2 get 1). Estimasi penghematan: Rp 45.000 untuk belanja minggu depan.',
      savings: 'Rp 45.000',
      store: 'Superindo',
      deals: ['Susu Ultra (diskon 20%)', 'Telur (buy 2 get 1)'],
    },
  ];

  const getStatusColor = (type: any) => {
    switch (type) {
      case 'analysis':
        return 'primary';
      case 'target':
        return 'success';
      case 'alert':
        return 'warning';
      case 'recommendation':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br to-blue-50 dark:to-default-950 p-6'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
            AI Insights & Rekomendasi
          </h1>
          <p className='dark:text-gray-200'>
            Analisis cerdas untuk keuangan yang lebih baik
          </p>
        </div>

        {/* Tips Card at the top */}
        <Card className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
          <CardBody className='text-center py-6'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <Lightbulb className='w-5 h-5' />
              <h3 className='text-lg font-semibold'>Tips Hari Ini</h3>
            </div>
            <p className='text-blue-100'>
              Gunakan metode 50/30/20: 50% kebutuhan, 30% keinginan, 20%
              tabungan untuk keuangan yang seimbang.
            </p>
          </CardBody>
        </Card>

        <div className='flex justify-end mb-4'>
          <Button
            color='primary'
            onPress={() => alert('Add new insight feature coming soon!')}
          >
            + Add New Insight
          </Button>
        </div>

        {/* Insights Cards */}
        <div className='space-y-4'>
          {insights.map((insight) => (
            <Card
              key={insight.id}
              className='hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500'
              shadow='sm'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`p-2 rounded-full ${insight.iconColor} text-white`}
                  >
                    {insight.icon}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold dark:text-gray-200'>
                      {insight.title}
                    </h3>
                    <Chip
                      size='sm'
                      color={getStatusColor(insight.type)}
                      variant='flat'
                      className='mt-1'
                    >
                      {insight.type.charAt(0).toUpperCase() +
                        insight.type.slice(1)}
                    </Chip>
                  </div>
                </div>
              </CardHeader>

              <CardBody className='pt-0'>
                <p className='leading-relaxed mb-4 dark:text-gray-200'>
                  {insight.content}
                </p>

                {/* Analysis specific content */}
                {insight.type === 'analysis' && (
                  <div className='flex flex-wrap gap-4 items-center'>
                    <div className='flex items-center gap-2 px-3 py-2 rounded-lg'>
                      <ArrowUp className='w-4 h-4 text-red-500' />
                      <span className='text-red-600 font-medium'>
                        {insight.percentage}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>{insight.amount}</span>
                    </div>
                    <Chip size='sm' color='primary' variant='flat'>
                      {insight.category}
                    </Chip>
                  </div>
                )}

                {/* Target specific content */}
                {insight.type === 'target' && (
                  <div className='space-y-3'>
                    <div className='flex justify-between text-sm dark:text-gray-200'>
                      <span>{insight.currentAmount}</span>
                      <span>{insight.targetAmount}</span>
                    </div>
                    <Progress
                      value={insight.progress}
                      color='success'
                      className='w-full'
                      size='md'
                    />
                    <div className='flex items-center justify-between'>
                      <span className='text-sm dark:text-gray-200'>
                        {insight.progress}% tercapai
                      </span>
                      <Chip size='sm' color='success' variant='flat'>
                        +{insight.projectedExcess} proyeksi
                      </Chip>
                    </div>
                  </div>
                )}

                {/* Alert specific content */}
                {insight.type === 'alert' && (
                  <div className='space-y-3'>
                    <div className='flex justify-between text-sm dark:text-gray-200'>
                      <span>{insight.usedAmount}</span>
                      <span>{insight.totalBudget}</span>
                    </div>
                    <Progress
                      value={insight.progress}
                      color='warning'
                      className='w-full'
                      size='md'
                    />
                    <div className='flex items-center justify-between'>
                      <span className='text-sm dark:text-gray-200'>
                        {insight.progress}% terpakai
                      </span>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-4 h-4 text-orange-500' />
                        <span className='text-sm text-orange-600'>
                          {insight.daysLeft} hari tersisa
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendation specific content */}
                {insight.type === 'recommendation' && (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between bg-green-50 p-3 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <span className='text-green-700 font-medium'>
                          Potensi hemat: {insight.savings}
                        </span>
                      </div>
                      <Chip size='sm' color='success' variant='solid'>
                        {insight.store}
                      </Chip>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {insight.deals?.map((deal, index) => (
                        <Chip
                          key={index}
                          size='sm'
                          variant='bordered'
                          color='secondary'
                        >
                          {deal}
                        </Chip>
                      ))}
                    </div>
                    <Button
                      color='primary'
                      variant='flat'
                      size='sm'
                      className='w-full mt-3'
                    >
                      Lihat Promo Lengkap
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
