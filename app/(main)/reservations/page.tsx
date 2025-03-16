import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from '../components/page-header';
import { QRCodeModal } from './components/qr-code-modal';
import { ReservationList } from './components/reservation-list';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ReservationsPage() {
  // ユーザーセッションの取得
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    // 未ログインの場合はログインページにリダイレクト
    redirect('/api/auth/signin?callbackUrl=/reservations');
  }
  
  // ユーザーの予約情報を取得
  const reservations = await db.reservation.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      quest: true,
    },
    orderBy: {
      reservedAt: 'desc',
    },
  });
  
  // 予約済みと完了済みに分類
  const today = new Date();
  
  const upcomingReservations = reservations.filter(reservation => {
    // questDateがある場合は日付で比較、ない場合はstatusで判断
    if (reservation.quest.questDate) {
      return new Date(reservation.quest.questDate) >= today;
    }
    return reservation.status === 'confirmed';
  });
  
  const completedReservations = reservations.filter(reservation => {
    // questDateがある場合は日付で比較、ない場合はstatusで判断
    if (reservation.quest.questDate) {
      return new Date(reservation.quest.questDate) < today;
    }
    return reservation.status === 'completed';
  });
  
  return (
    <>
      <PageHeader title="予約管理" />
      <div className="container mx-auto px-4 py-8">
        {reservations.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-lg">予約がありません</p>
            <a href="/" className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              クエストを探す
            </a>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">予約済みクエスト</TabsTrigger>
              <TabsTrigger value="completed">完了したクエスト</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingReservations.length > 0 ? (
                <ReservationList reservations={upcomingReservations} />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-lg">予約済みのクエストはありません</p>
                  <a href="/" className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                    クエストを探す
                  </a>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedReservations.length > 0 ? (
                <ReservationList reservations={completedReservations} />
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-lg">完了したクエストはありません</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}