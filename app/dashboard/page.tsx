import { TrendingUp } from 'lucide-react';
import Sidebar from '../components/sidebar';
import ProductChart from '../components/products-chart';
import StockChart from '../components/stock-chart';

export interface Product {
  title: string;
  stock: number;
  price: number;
  sku: string;
}

export default async function DashboardPage() {
  const totalProducts = Math.max(10, Math.ceil(Math.random() * 35));
  let response = await fetch(
    `https://dummyjson.com/products?limit=${totalProducts}`,
  );
  response = await response.json();
  const allProducts: Product[] = response.products;
  const lowStock = allProducts.filter((product) => product.stock < 50).length;

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.stock),
    0,
  );

  const inStockCount = allProducts.filter((p) => Number(p.stock) > 50).length;
  const lowStockCount = allProducts.filter(
    (p) => Number(p.stock) <= 50 && Number(p.stock) >= 1,
  ).length;
  const outOfStockCount = allProducts.filter(
    (p) => Number(p.stock) === 0,
  ).length;

  console.log(inStockCount, lowStockCount, outOfStockCount);

  const inStockPercentage =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPercentage =
    totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const outOfStockPercentage =
    totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

  console.log(inStockPercentage, lowStockPercentage, outOfStockPercentage);

  const now = new Date();
  const weeklyProductsData = [];

  function generateWeeklyProducts(total: number, weeks = 12) {
    const result = [];
    let remaining = total;

    for (let i = 0; i < weeks; i++) {
      if (i === weeks - 1) {
        result.push(remaining);
      } else {
        const max = Math.floor(remaining / (weeks - i));
        const value = Math.floor(Math.random() * (max + 1));
        result.push(value);
        remaining -= value;
      }
    }

    return result;
  }

  const weeklyDistribution = generateWeeklyProducts(totalProducts);

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekStart.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      '0',
    )}/${String(weekStart.getDate() + 1).padStart(2, '0')}`;

    const weekProducts = weeklyDistribution[11 - i];

    weeklyProductsData.push({
      week: weekLabel,
      products: weekProducts,
    });
  }

  const stockData = [
    { name: 'In Stock', value: inStockPercentage, fill: '#9333ea' },
    { name: 'Low Stock', value: lowStockPercentage, fill: '#C084FC' },
    { name: 'Out of Stock', value: outOfStockPercentage, fill: '#E9D5FF' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Welcome back! Here is an overview of your inventory.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Key Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-15">
              Key Metrics
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {totalProducts}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">
                    +{Math.floor(Math.random() * totalProducts)}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  ${Number(totalValue).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">
                    +$
                    {Math.floor(Math.random() * Number(totalValue)).toFixed(0)}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {lowStock}
                </div>
                <div className="text-sm text-gray-600">Low Stock</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">
                    +{Math.floor(Math.random() * lowStock)}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Iventory over time */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                New products per week
              </h2>
            </div>
            <div className="h-48">
              <ProductChart data={weeklyProductsData} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stock Levels */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Levels (Recent 5)
              </h2>
            </div>
            <div className="space-y-3">
              {allProducts.slice(0, 5).map((product, key) => {
                const stockLevel =
                  product.stock === 0 ? 0 : product.stock <= 50 ? 1 : 2;

                const bgColors = [
                  'bg-red-600',
                  'bg-yellow-600',
                  'bg-green-600',
                ];
                const textColors = [
                  'text-red-600',
                  'text-yellow-600',
                  'text-green-600',
                ];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {product.title}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-medium ${textColors[stockLevel]}`}
                    >
                      {product.stock} units
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Efficiency */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Efficiency
              </h2>
            </div>

            <StockChart data={stockData} />
            {/* <div className="mt-6 space-y-2"> */}
            <div className="flex justify-around mt-8 mb-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>In Stock ({inStockPercentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400" />
                  <span>Low Stock ({lowStockPercentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-200" />
                  <span>Out of Stock ({outOfStockPercentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
