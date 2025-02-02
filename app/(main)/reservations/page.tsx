"use client";

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReservationList } from './components/reservation-list';
import { PageHeader } from '../components/page-header';

export default function ReservationsPage() {
  return (
    <>
      <PageHeader title="予約管理" />

      <main className="container mx-auto px-4 py-6 pb-24 relative">
        <div className="bg-[#463C2D]/80 backdrop-blur rounded-lg border border-[#C0A172] overflow-hidden">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-[#5C4D3C] p-0 h-12">
              <TabsTrigger 
                value="upcoming"
                className="h-12 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-[#E8D4B9]"
              >
                クエスト前
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="h-12 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-[#E8D4B9]"
              >
                クエスト後
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="overflow-hidden">
              <ReservationList status="reserved" />
            </TabsContent>

            <TabsContent value="completed" className="overflow-hidden">
              <ReservationList status="completed" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}