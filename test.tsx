'use client'

import { Menu, Bell, Settings, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const DonutChart = ({ value, color, size = 80 }) => {
  const data = [
    { value: value, color: color },
    { value: 100 - value, color: '#4b5563' },
  ]

  return (
    <ResponsiveContainer width={size} height={size}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={size / 3}
          outerRadius={size / 2}
          fill="#8884d8"
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between p-4 bg-black border-b border-white/10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-orange-500" />
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      <main className="p-6 grid grid-cols-3 gap-6">
        <Card className="col-span-2 bg-black border border-white/10 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-[16/9] w-full relative">
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white text-black rounded-full px-3 py-1 flex items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full mr-2" />
                <span>+7 min</span>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white rounded-md px-4 py-2">
                40 min
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border border-white/10 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-4xl font-bold mb-2">Design smarter,</h2>
            <h2 className="text-4xl font-bold mb-4">publish faster.</h2>
            <p className="text-sm text-gray-400 mb-6">Design and publish modern sites at any scale with Framer's web builder.</p>
            <div className="bg-red-600 p-3 rounded-xl">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 text-lg rounded-full mb-3">
                Call for truck
              </Button>
              <Button variant="outline" className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 text-lg rounded-full">
                Browse Gallery
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-black border border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-green-500">Litter Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="text-left text-green-500">
                  <th>Location</th>
                  <th>Image</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { location: "77.5946, 12.9716", timestamp: "21/09/2024, 11:23:04" },
                  { location: "2.3522, 48.8566", timestamp: "21/09/2024, 11:24:26" },
                  { location: "18.4241, -33.9249", timestamp: "21/09/2024, 11:24:34" },
                  { location: "-73.9352, 40.7306", timestamp: "21/09/2024, 14:47:41" },
                ].map((log, index) => (
                  <tr key={index} className="border-t border-white/10">
                    <td className="py-2 flex items-center">
                      <span className="mr-2">📍</span>
                      {log.location}
                    </td>
                    <td className="py-2">
                      <Button variant="link" className="text-green-500">View Image</Button>
                    </td>
                    <td className="py-2 flex items-center">
                      <span className="mr-2">🕒</span>
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-yellow-400 border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-black">Upcoming Event</h3>
                  <p className="text-sm text-gray-700">PICT 1</p>
                </div>
                <img src="/placeholder.svg?height=64&width=64" alt="Event" className="w-16 h-16 rounded-full" />
              </div>
              <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-yellow-400">
                April 2
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black border border-white/10 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-row justify-between items-center">
                <div className="flex-1">
                  <DonutChart value={66} color="#22c55e" size={80} />
                </div>
                <div className="flex-1">
                  <DonutChart value={33} color="#22c55e" size={80} />
                </div>
              </div>
              <div className="flex flex-row justify-between items-center mt-2">
                <div className="flex-1 text-center">
                  <span className="text-sm font-medium">Visitors</span>
                  <p className="text-xl font-bold">1,125</p>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-medium">Views</span>
                  <p className="text-xl font-bold">200</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}