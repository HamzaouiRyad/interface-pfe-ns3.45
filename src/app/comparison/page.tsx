"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, BarChart3 } from "lucide-react";
import ThroughputChart from "@/components/comparison/ThroughputChart";
import RSRPChart from "@/components/comparison/RSRPChart";
import LatencyChart from "@/components/comparison/LatencyChart";
import SINRChart from "@/components/comparison/SINRChart";
import PacketLossChart from "@/components/comparison/PacketLossChart";
import PowerConversionSection from "@/components/comparison/PowerConversionSection";

// Type definitions for CSV data
interface CSVData {
  time_s?: number;

  throughput_dl_mbps?: number;
  throughput_ul_mbps?: number;

  latence_ms?: number;
  jitter_ms?: number;

  sinr_db?: number;

  rsrp_dbm?: number;

  perte_dl_pct?: number;

  handovers_cumul?: number;
}

export default function ComparisonPage() {
  const [chartsVisible, setChartsVisible] = useState(false);
  const [csvData4G, setCsvData4G] = useState<CSVData[] | null>(null);
  const [csvData5G, setCsvData5G] = useState<CSVData[] | null>(null);

  // CSV Parser function
  const parseCSV = (csvText: string): CSVData[] => {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const data: CSVData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const row: CSVData = {};

      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        const num = Number(value);

        if (!isNaN(num)) {
          (row as any)[header] = num;
        }
      });

      data.push(row);
    }

    return data;
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    is5G: boolean,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const data = parseCSV(content);

      if (is5G) {
        setCsvData5G(data);
      } else {
        setCsvData4G(data);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateCharts = () => {
    setChartsVisible(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 text-white py-12 px-6">
      {/* HEADER */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-red-400 bg-clip-text text-transparent">
            Comparaison Réseaux : 4G LTE VS 5G NR
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium">
            Analyses et métriques de performance — Université USTO-MB (M2 RT)
          </p>
        </div>
      </section>

      {/* DATA IMPORT SECTION */}
      <section className="max-w-7xl mx-auto mb-12">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Configuration des sources
              </h2>
              <p className="text-gray-400">
                Chargez les fichiers CSV de performance 4G et 5G
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Button 4G */}
              <div className="group">
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-red-500/40 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 bg-red-500/5">
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <Cloud className="w-10 h-10 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-red-400">
                      Charger le fichier
                    </p>
                    <p className="text-xs text-red-300 mt-1">
                      (Fichier-4g.csv)
                    </p>
                    {csvData4G && (
                      <p className="text-xs text-green-400 mt-2">
                        ✓ Fichier chargé ({csvData4G.length} lignes)
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, false)}
                  />
                </label>
              </div>

              {/* Upload Button 5G */}
              <div className="group">
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-blue-500/40 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 bg-blue-500/5">
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <Cloud className="w-10 h-10 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-blue-400">
                      Charger le fichier
                    </p>
                    <p className="text-xs text-blue-300 mt-1">
                      (Fichier_5g.csv)
                    </p>
                    {csvData5G && (
                      <p className="text-xs text-green-400 mt-2">
                        ✓ Fichier chargé ({csvData5G.length} lignes)
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, true)}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleGenerateCharts}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Générer les Graphiques
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* CHARTS SECTION */}
      {chartsVisible && (
        <section className="max-w-7xl mx-auto space-y-12">
          {/* Throughput Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Graphe 1 : Débit (Throughput) en fonction du Temps
            </h2>
            <ThroughputChart
              csvData4G={csvData4G || []}
              csvData5G={csvData5G || []}
            />
          </Card>
          {/* RSRP Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Graphe 2 : RSRP en fonction du Temps
            </h2>
            <p className="text-gray-400 mb-6">
              Comparaison du RSRP entre le réseau 4G LTE et le réseau 5G NR
            </p>
            <RSRPChart
              csvData4G={csvData4G || []}
              csvData5G={csvData5G || []}
            />{" "}
          </Card>
          {/* Latency Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Graphe 3 : Latence / TTI vs Distance
            </h2>
            <LatencyChart
              csvData4G={csvData4G || []}
              csvData5G={csvData5G || []}
            />
          </Card>

          {/* Power Conversion Section */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Section 4 : Conversion de Puissance (Formule & Graphique)
            </h2>
            <PowerConversionSection
              data4G={csvData4G || []}
              data5G={csvData5G || []}
            />{" "}
          </Card>

          {/* SINR Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Graphe 4 : SINR en fonction du Temps / Distance
            </h2>
            <SINRChart
              csvData4G={csvData4G || []}
              csvData5G={csvData5G || []}
            />{" "}
          </Card>

          {/* Packet Loss Chart */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Graphe 5 : Taux de perte de paquets par scénario
            </h2>
            <PacketLossChart
              csvData4G={csvData4G || []}
              csvData5G={csvData5G || []}
            />
          </Card>
        </section>
      )}
    </div>
  );
}
