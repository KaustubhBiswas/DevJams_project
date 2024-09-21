"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, ImageIcon, MapPinIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LitterLog {
  _id: string
  location: {
    coordinates: [number, number]
  }
  imageUrl: string
  isDeleted: boolean
  timestamp: string
  __v: number
  address?: string 
}

export default function LitterLogsTable() {
  const [litterLogs, setLitterLogs] = useState<LitterLog[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  useEffect(() => {
    const fetchLitterLogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/litterlogs/getalllitterlogs")
        setIsLoading(false)
        if (!response.ok) {
          throw new Error("Failed to fetch litter logs")
        }
        const data: LitterLog[] = await response.json()

        // Fetch addresses for each litter log
        const logsWithAddresses = await Promise.all(
          data.map(async (log) => {
            const address = await fetchAddress(log.location.coordinates)
            return { ...log, address }
          })
        )
        
        setLitterLogs(logsWithAddresses)
      } catch (error) {
        console.error("Error fetching litter logs:", error)
      }
    }

    fetchLitterLogs()
  }, [])

  const fetchAddress = async (coordinates: [number, number]) => {
    try {
      // Ensure that latitude and longitude are valid and formatted to six decimal places
      const [lat, lng] = coordinates;
  
      // Validate lat and lng ranges
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.error("Invalid latitude or longitude values");
        return "Invalid coordinates";
      }
  
      // Use `toFixed(6)` to round off the lat and lng
      const latFormatted = lat.toFixed(6);
      const lngFormatted = lng.toFixed(6);
  
      // Construct the request URL for the Google Maps API
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latFormatted},${lngFormatted}&key=${API_KEY}`;
      console.log("Request URL:", url);  // Debugging the URL
  
      const response = await fetch(url);
  
      if (!response.ok) {
        console.error("API request failed with status:", response.status);
        return "Failed to fetch address";
      }
  
      const data = await response.json();
      console.log("Geocoding response:", data);  // Debugging response data
  
      // Check if the API returned valid results
      if (data.results && data.results.length > 0) {
        const placeName = data.results.find(result =>
          result.types.includes("locality") || 
          result.types.includes("administrative_area_level_1") || 
          result.types.includes("country")
        );
        return placeName ? placeName.formatted_address : data.results[0].formatted_address;
      }
  
      return "Address not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Address not available";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // const formatCoordinates = (coordinates: [number, number]) => {
  //   return `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`
  // }

  const SkeletonRow = () => (
    <TableRow className="hover:bg-gray-800">
      <TableCell>
        <div className="flex items-center">
          <MapPinIcon className="w-4 h-4 mr-2 text-green-400"/>
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <ImageIcon className="w-4 h-4 mr-2 text-green-400"/>
          <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2 text-green-400" />
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black text-white">
  <CardHeader>
    <CardTitle className="text-2xl font-bold text-center text-green-400">Litter Logs</CardTitle>
  </CardHeader>
  <CardContent>
    <Table className="table-auto w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="text-green-400 text-left w-1/3">Location</TableHead>
          <TableHead className="text-green-400 text-left w-1/3">Image</TableHead>
          <TableHead className="text-green-400 text-left w-1/3">Timestamp</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
    <ScrollArea className="h-[150px] overflow-auto">
      <Table className="table-auto w-full">
        <TableBody>
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            litterLogs.map((log) => (
              <TableRow key={log._id} className="hover:bg-gray-800">
                <TableCell className="w-1/3">
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-green-400" />
                    {log.address ? log.address : "Fetching address..."}
                  </div>
                </TableCell>
                <TableCell className="w-1/3">
                  <div className="flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2 text-green-400" />
                    <a href={log.imageUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                      View Image
                    </a>
                  </div>
                </TableCell>
                <TableCell className="w-1/3">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-green-400" />
                    {formatDate(log.timestamp)}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  </CardContent>
</Card>
  )
}