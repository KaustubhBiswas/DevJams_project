"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, ImageIcon, MapPinIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Image {
  url: string
  location: {
    coordinates: [number, number]
    address?: string
  }
  timestamp: string
}

export default function LitterLogsTable() {
  // const [litterLogs, setLitterLogs] = useState<LitterLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY

  const [images, setImages] = useState<Image[]>([])

  const parseLocation = (location: string) => {
    // Check if the location is in the format 'latitude,longitude'
    if (location && typeof location === 'string') {
      const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng] as [number, number];
      }
    }
    return [undefined, undefined];
  }
  
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/s3images');
        const data = await res.json();
        setIsLoading(false)
        const imagesWithAddresses = await Promise.all(
          data.images.map(async (image: Image) => {
            const coordinates = parseLocation(image.location as unknown as string); // Assume location is a string
            if (coordinates) {
              const address = await fetchAddress(coordinates);
              return { ...image, location: { coordinates, address } };
            }
            return image;
          })
        );
  
        setImages(imagesWithAddresses);
      } catch (error) {
        console.error('Error fetching images from API:', error);
      }
    }
  
    fetchImages();
  }, []);

  const fetchAddress = async (coordinates: [number, number]) => {
    try {
      const [lat, lng] = coordinates

      // Validate lat and lng ranges
      if (typeof lat !== "number" || typeof lng !== "number" || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.error("Invalid latitude or longitude values")
        return "Invalid coordinates"
      }

      const latFormatted = lat.toFixed(6)
      const lngFormatted = lng.toFixed(6)

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latFormatted},${lngFormatted}&key=${API_KEY}`
      console.log("Request URL:", url)  // Debugging the URL

      const response = await fetch(url)

      if (!response.ok) {
        console.error("API request failed with status:", response.status)
        return "Failed to fetch address"
      }

      const data = await response.json()

      // Check if the API returned valid results
      if (data.results && data.results.length > 0) {
        const placeName = data.results.find(result =>
          result.types.includes("locality") || 
          result.types.includes("administrative_area_level_1") || 
          result.types.includes("country")
        )
        return placeName ? placeName.formatted_address : data.results[0].formatted_address
      }

      return "Address not found"
    } catch (error) {
      console.error("Error fetching address:", error)
      return "Address not available"
    }
  }

  const formatDate = (timestamp: string) => {
    const match = timestamp.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/)
    if (match) {
      const [ , year, month, day, hour, minute, second ] = match
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric', 
        hour12: true 
      })
    }
    return "Invalid Date"
  }

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
    <Card className="col-span-2 w-3/5  bg-black border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-left text-white">LITTER LOGS</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="table-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-green-400 text-left w-1/4">Location</TableHead>
              <TableHead className="text-green-400 text-left w-1/6">Image</TableHead>
              <TableHead className="text-green-400 text-left w-1/4">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <ScrollArea className="h-[190px] overflow-auto">
          <Table className="table-auto w-full">
            <TableBody>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                images.map((image, index) => (
                  <TableRow key={index} className="hover:bg-gray-800">
                    <TableCell className="w-1/4">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2 text-orange-500" />
                        {image.location.address || "Unknown location"}
                      </div>
                    </TableCell>
                    <TableCell className="w-1/6">
                      <div className="flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2 text-orange-500" />
                        <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-orange-500 hover:underline">
                          View Image
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/4">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-orange-500" />
                        {image.timestamp ? formatDate(image.timestamp) : "Unknown timestamp"}
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
