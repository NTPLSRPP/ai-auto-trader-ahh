import { useEffect, useState } from 'react';
import { getTraders, getStatus, getPositions, startTrader, stopTrader } from '../lib/api';
import type { Trader, Position } from '../types';
import { Play, Square, RefreshCw, TrendingUp, TrendingDown, Activity, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [selectedTrader, setSelectedTrader] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTraders();
  }, []);

  useEffect(() => {
    if (selectedTrader) {
      loadTraderData();
      const interval = setInterval(loadTraderData, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedTrader]);

  const loadTraders = async () => {
    try {
      const res = await getTraders();
      setTraders(res.data.traders || []);
      if (res.data.traders?.length > 0 && !selectedTrader) {
        setSelectedTrader(res.data.traders[0].id);
      }
    } catch (err) {
      console.error('Failed to load traders:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTraderData = async () => {
    if (!selectedTrader) return;
    try {
      const [statusRes, positionsRes] = await Promise.all([
        getStatus(selectedTrader),
        getPositions(selectedTrader),
      ]);
      setStatus(statusRes.data);
      setPositions(positionsRes.data.positions || []);
    } catch (err) {
      console.error('Failed to load trader data:', err);
    }
  };

  const handleStart = async (id: string) => {
    try {
      await startTrader(id);
      loadTraders();
      loadTraderData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to start trader');
    }
  };

  const handleStop = async (id: string) => {
    try {
      await stopTrader(id);
      loadTraders();
      loadTraderData();
    } catch (err) {
      console.error('Failed to stop trader:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
  const totalPnLPercent = positions.length > 0
    ? positions.reduce((sum, p) => sum + p.pnl_percent, 0) / positions.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your AI trading bots</p>
        </div>
        <Button variant="outline" size="icon" onClick={loadTraderData}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      {selectedTrader && status && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${status.running ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-2xl font-bold">{status.running ? 'Running' : 'Stopped'}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {status.strategy || 'Default Strategy'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positions</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{positions.length}</div>
              <p className="text-xs text-muted-foreground">
                Active positions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unrealized PnL</CardTitle>
              {totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${totalPnL.toFixed(2)}
              </div>
              <p className={`text-xs ${totalPnLPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}% avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trading Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status.pairs?.length || 0}</div>
              <p className="text-xs text-muted-foreground truncate">
                {status.pairs?.join(', ') || 'None'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Traders List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Traders</CardTitle>
            <CardDescription>Select a trader to view details</CardDescription>
          </CardHeader>
          <CardContent>
            {traders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No traders configured. Go to Config to create one.</p>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {traders.map((trader) => (
                    <div
                      key={trader.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                        selectedTrader === trader.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      onClick={() => setSelectedTrader(trader.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{trader.name}</span>
                        <Badge variant={trader.is_running ? 'default' : 'secondary'}>
                          {trader.is_running ? 'Running' : 'Stopped'}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        {trader.is_running ? (
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={(e) => { e.stopPropagation(); handleStop(trader.id); }}
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="default"
                            className="h-8 w-8 bg-green-600 hover:bg-green-500"
                            onClick={(e) => { e.stopPropagation(); handleStart(trader.id); }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Trading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTrader && status ? (
              <Tabs defaultValue="positions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="positions">Positions</TabsTrigger>
                  <TabsTrigger value="decisions">AI Decisions</TabsTrigger>
                </TabsList>

                <TabsContent value="positions" className="mt-4">
                  {positions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No open positions
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Side</TableHead>
                          <TableHead className="text-right">Size</TableHead>
                          <TableHead className="text-right">Entry</TableHead>
                          <TableHead className="text-right">Mark</TableHead>
                          <TableHead className="text-right">PnL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {positions.map((pos, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{pos.symbol}</TableCell>
                            <TableCell>
                              <Badge variant={pos.side === 'LONG' ? 'default' : 'destructive'}>
                                {pos.side}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{Math.abs(pos.amount).toFixed(4)}</TableCell>
                            <TableCell className="text-right">${pos.entry_price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${pos.mark_price.toFixed(2)}</TableCell>
                            <TableCell className={`text-right font-medium ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              ${pos.pnl.toFixed(2)} ({pos.pnl_percent.toFixed(2)}%)
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="decisions" className="mt-4">
                  {status.decisions && Object.keys(status.decisions).length > 0 ? (
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {Object.entries(status.decisions).map(([symbol, dec]: [string, any]) => (
                          <div key={symbol} className="p-4 rounded-lg bg-muted">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">{symbol}</span>
                              <Badge variant={
                                dec.action === 'BUY' ? 'default' :
                                dec.action === 'SELL' ? 'destructive' :
                                dec.action === 'CLOSE' ? 'outline' :
                                'secondary'
                              }>
                                {dec.action}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-muted-foreground">Confidence:</span>
                              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${dec.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{dec.confidence}%</span>
                            </div>
                            <Separator className="my-2" />
                            <p className="text-sm text-muted-foreground">{dec.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent AI decisions
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a trader to view activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
