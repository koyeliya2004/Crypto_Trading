"use client";

import { useState, useRef, useEffect } from "react";
import MarketOverview from './MarketOverview';
import TechnicalAnalysis from './TechnicalAnalysis';
import PricePrediction from './PricePrediction';
import NewsAnalysis from './NewsAnalysis';
import RiskAnalysis from './RiskAnalysis';
import AITradingAssistant from './AITradingAssistant';
import TradingSimulator from './TradingSimulator';
import ChatbotAssistant from './ChatbotAssistant';
import SentimentAnalysis from './SentimentAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CryptoAsset } from '../types/market';
import { ChevronDownIcon, ChevronUpIcon, TrendingUpIcon, BarChart3Icon, NewspaperIcon, MessagesSquareIcon, HomeIcon } from 'lucide-react';

export default function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [isSignalsOpen, setIsSignalsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  
  // Refs for scrolling
  const homeRef = useRef<HTMLDivElement>(null);
  const marketRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  // Scroll to section when navbar item is clicked
  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
      'home': homeRef,
      'market': marketRef,
      'news': newsRef,
      'chat': chatRef
    };
    
    if (refMap[section]?.current) {
      refMap[section].current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      const sections = [
        { id: 'home', ref: homeRef },
        { id: 'market', ref: marketRef },
        { id: 'news', ref: newsRef },
        { id: 'chat', ref: chatRef }
      ];
      
      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop && 
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Fixed Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-amber-800/20">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex h-14 items-center justify-between">
            <h1 className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">AI CryptoMentor</h1>
            <div className="flex space-x-1 sm:space-x-2 md:space-x-4">
              <Button 
                variant={activeSection === 'home' ? "default" : "ghost"} 
                size="sm" 
                onClick={() => scrollToSection('home')}
                className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-10 px-2 sm:px-3 ${activeSection === 'home' ? 'bg-gradient-to-r from-amber-600 to-orange-600 shadow-md shadow-amber-600/30' : ''}`}
              >
                <HomeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs md:text-sm">Home</span>
              </Button>
              <Button 
                variant={activeSection === 'market' ? "default" : "ghost"} 
                size="sm" 
                onClick={() => scrollToSection('market')}
                className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-10 px-2 sm:px-3 ${activeSection === 'market' ? 'bg-gradient-to-r from-amber-600 to-orange-600 shadow-md shadow-amber-600/30' : ''}`}
              >
                <TrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs md:text-sm">Market</span>
              </Button>
              <Button 
                variant={activeSection === 'news' ? "default" : "ghost"} 
                size="sm" 
                onClick={() => scrollToSection('news')}
                className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-10 px-2 sm:px-3 ${activeSection === 'news' ? 'bg-gradient-to-r from-amber-600 to-orange-600 shadow-md shadow-amber-600/30' : ''}`}
              >
                <NewspaperIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs md:text-sm">News</span>
              </Button>
              <Button 
                variant={activeSection === 'chat' ? "default" : "ghost"} 
                size="sm" 
                onClick={() => scrollToSection('chat')}
                className={`flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-10 px-2 sm:px-3 ${activeSection === 'chat' ? 'bg-gradient-to-r from-amber-600 to-orange-600 shadow-md shadow-amber-600/30' : ''}`}
              >
                <MessagesSquareIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs md:text-sm">Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Home Section */}
        <section ref={homeRef} className="py-4 sm:py-6 md:py-8">
          <div className="container mx-auto px-2 sm:px-4 relative">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="coin coin-lg coin-glow left-[4%] top-4" />
              <div className="coin coin-md coin-glow right-[6%] top-10 animate-delay-2000" />
              <div className="coin coin-sm left-[18%] bottom-10 animate-delay-1000" />
              <div className="coin coin-md right-[18%] bottom-6 animate-delay-3000" />
              <div className="crypto-orbit left-[38%] top-6 animate-delay-2000" />
              <div className="crypto-orbit right-[30%] bottom-12 animate-delay-1000" />
              <div className="crypto-chip left-[28%] top-24 animate-delay-3000" />
              <div className="crypto-chip right-[22%] bottom-20" />
            </div>
            <header className="mb-4 sm:mb-6 md:mb-8 text-center">
              <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 sm:px-4 py-1 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.3em] text-amber-200/90">
                Quantum Signals Engine
              </div>
              <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-200">
                AI CryptoMentor
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm sm:text-base px-4">
                Deep gold intelligence for real-time crypto decisions, powered by adaptive forecasts, live sentiment, and multi-layer risk shields.
              </p>
              <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
                <Button className="btn-primary ember-glow px-4 py-3 sm:px-6 sm:py-5 text-sm font-semibold">
                  Start Guided Session
                </Button>
                <Button variant="outline" className="golden-border px-4 py-3 sm:px-6 sm:py-5 text-sm font-semibold">
                  Explore Signal Map
                </Button>
              </div>
            </header>

            <div className="container mx-auto px-4">
              <div className="py-12" />
              {/* Removed dashboard cards to clean up the hero area per request. */}
            </div>
          </div>
        </section>

        {/* Market & Analysis Section */}
        <section ref={marketRef} className="py-4 sm:py-6">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
              {/* Market Overview - Bigger Tiles */}
              <div className="lg:col-span-5">
                <MarketOverview onAssetSelect={setSelectedAsset} />
              </div>

              {/* Analysis Section */}
              <div className="lg:col-span-7">
                <div className="h-auto min-h-[300px] sm:min-h-[420px] lg:h-[620px]">
                  {selectedAsset ? (
                    <div className="h-full">
                      <Collapsible 
                        open={isSignalsOpen} 
                        onOpenChange={setIsSignalsOpen}
                        className="glassmorphic rounded-xl overflow-hidden h-full"
                      >
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-2 font-medium">
                            <BarChart3Icon className="h-5 w-5 text-amber-400" />
                            Trading Signals & Analysis for {selectedAsset.name}
                          </div>
                          {isSignalsOpen ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="h-[calc(100%-60px)] overflow-auto">
                          <div className="p-2 sm:p-4 pt-0">
                            <Tabs defaultValue="technical" className="w-full h-full">
                              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
                                <TabsTrigger value="technical">Technical</TabsTrigger>
                                <TabsTrigger value="prediction">Prediction</TabsTrigger>
                                <TabsTrigger value="risk">Risk</TabsTrigger>
                                <TabsTrigger value="trading">Trading</TabsTrigger>
                                <TabsTrigger value="simulator">Simulator</TabsTrigger>
                              </TabsList>
                              <TabsContent value="technical" className="h-full overflow-auto">
                                <Card className="glassmorphic mt-6 h-full">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <BarChart3Icon className="h-5 w-5 text-amber-400" />
                                      Technical Analysis
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="h-[calc(100%-60px)] overflow-auto">
                                    <TechnicalAnalysis asset={selectedAsset} />
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              <TabsContent value="prediction" className="h-full overflow-auto">
                                <Card className="glassmorphic mt-6 h-full">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <BarChart3Icon className="h-5 w-5 text-amber-400" />
                                      Price Prediction
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="h-[calc(100%-60px)] overflow-auto">
                                    <PricePrediction asset={selectedAsset} />
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              <TabsContent value="risk" className="h-full overflow-auto">
                                <Card className="glassmorphic mt-6 h-full">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <BarChart3Icon className="h-5 w-5 text-amber-400" />
                                      Risk Analysis
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="h-[calc(100%-60px)] overflow-auto">
                                    <RiskAnalysis asset={selectedAsset} />
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              <TabsContent value="trading" className="h-full overflow-auto">
                                <Card className="glassmorphic mt-6 h-full">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <BarChart3Icon className="h-5 w-5 text-amber-400" />
                                      AI Trading Assistant
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="h-[calc(100%-60px)] overflow-auto">
                                    <AITradingAssistant asset={selectedAsset} />
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              <TabsContent value="simulator" className="h-full overflow-auto">
                                <Card className="glassmorphic mt-6 h-full">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <BarChart3Icon className="h-5 w-5 text-amber-400" />
                                      Trading Simulator
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="h-[calc(100%-60px)] overflow-auto">
                                    <TradingSimulator asset={selectedAsset} />
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center glassmorphic rounded-xl p-8">
                      <div className="text-center">
                        <h3 className="text-xl font-medium mb-2">Select a cryptocurrency</h3>
                        <p className="text-muted-foreground">Choose an asset from the Market Overview to view detailed analysis</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section ref={newsRef} className="py-6 sm:py-8 md:py-12 bg-transparent">
          <div className="container mx-auto px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Market Intelligence & News</h2>
            <div className="backdrop-blur-sm bg-background/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-amber-900/10 shadow-xl shadow-black/20">
              <NewsAnalysis asset={selectedAsset} />
            </div>
          </div>
        </section>

        {/* Chat Assistant Section */}
        <section ref={chatRef} className="py-6 sm:py-8 md:py-12 bg-transparent">
          <div className="container mx-auto px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Voice of AI</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
              <div className="lg:col-span-8">
                <Card className="bg-background/40 backdrop-blur-md border-amber-900/20 shadow-2xl h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Intelligent Advisor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChatbotAssistant selectedAsset={selectedAsset} />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-4">
                <Card className="bg-background/40 backdrop-blur-md border-amber-900/20 shadow-2xl h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Social Pulse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SentimentAnalysis selectedAsset={selectedAsset} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto py-6 border-t border-amber-800/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground"> 2025 AI CryptoMentor. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span className="text-xs px-2 py-1 rounded-full bg-amber-600/20 text-amber-300">AI Powered</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
