
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TeamStats, GoalStatsData } from '@/types/goalStats';

const parseCSV = (csvText: string): { teams: TeamStats[], leagueAverages: TeamStats[] } => {
  console.log('Parsing CSV data...');
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  console.log('CSV Headers:', headers);
  console.log('Total lines:', lines.length);
  
  const allParsedData = lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const stats: any = {};
    
    headers.forEach((header, headerIndex) => {
      const cleanHeader = header.trim().replace(/"/g, '');
      const cleanValue = values[headerIndex]?.trim().replace(/"/g, '') || '';
      
      if (cleanHeader === 'Team' || cleanHeader === 'team' || cleanHeader.toLowerCase().includes('team')) {
        stats.Team = cleanValue;
      } else {
        stats[cleanHeader] = parseFloat(cleanValue) || 0;
      }
    });
    
    return stats as TeamStats;
  }).filter(team => {
    // Filter out entries with empty team names
    const teamName = team.Team;
    return teamName && teamName.trim() !== '';
  });

  // Separate league averages from regular teams
  const leagueAverages = allParsedData.filter(team => 
    team.Team.toLowerCase().includes('league average')
  );
  
  const teams = allParsedData.filter(team => {
    const teamName = team.Team;
    
    // Remove "League average" entries
    if (teamName.toLowerCase().includes('league average')) {
      return false;
    }
    
    // Remove league header entries (lines that only contain league name)
    if (teamName.includes(' - ') && (!team.GP || team.GP === 0)) {
      return false;
    }
    
    return true;
  });

  console.log('Parsed teams count:', teams.length);
  console.log('League averages found:', leagueAverages.length);
  console.log('League averages:', leagueAverages.map(avg => avg.Team));
  
  return { teams, leagueAverages };
};

const fetchCSVData = async (url: string): Promise<{ teams: TeamStats[], leagueAverages: TeamStats[] }> => {
  console.log(`Fetching data from: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}: ${response.status}`);
    }
    const csvText = await response.text();
    console.log(`Data fetched successfully from ${url}`);
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

export const useGoalStats = () => {
  console.log('useGoalStats hook called');

  const { data: homeData, isLoading: homeLoading, error: homeError } = useQuery({
    queryKey: ['homeStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/goal-stats-selector-pro/refs/heads/main/Goals_Stats_Home.csv'),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: awayData, isLoading: awayLoading, error: awayError } = useQuery({
    queryKey: ['awayStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/goal-stats-selector-pro/refs/heads/main/Goals_Stats_Away.csv'),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: overallData, isLoading: overallLoading, error: overallError } = useQuery({
    queryKey: ['overallStats'],
    queryFn: () => fetchCSVData('https://raw.githubusercontent.com/scooby75/goal-stats-selector-pro/refs/heads/main/Goals_Stats_Overall.csv'),
    retry: 3,
    retryDelay: 1000,
  });

  const isLoading = homeLoading || awayLoading || overallLoading;
  const error = homeError || awayError || overallError;

  const homeStats = homeData?.teams || [];
  const awayStats = awayData?.teams || [];
  const overallStats = overallData?.teams || [];
  const homeLeagueAverages = homeData?.leagueAverages || [];
  const awayLeagueAverages = awayData?.leagueAverages || [];
  const overallLeagueAverages = overallData?.leagueAverages || [];

  // Enhanced debugging
  console.log('Raw home stats count:', homeStats.length);
  console.log('Raw away stats count:', awayStats.length);
  console.log('Home league averages:', homeLeagueAverages.length);
  console.log('Away league averages:', awayLeagueAverages.length);

  const calculateLeagueAverage = () => {
    if (overallStats.length === 0) return { "1.5+": 0, "2.5+": 0, "3.5+": 0, "4.5+": 0 };
    
    const total15 = overallStats.reduce((sum, team) => sum + team["1.5+"], 0);
    const total25 = overallStats.reduce((sum, team) => sum + team["2.5+"], 0);
    const total35 = overallStats.reduce((sum, team) => sum + team["3.5+"], 0);
    const total45 = overallStats.reduce((sum, team) => sum + team["4.5+"], 0);
    
    return {
      "1.5+": Math.round((total15 / overallStats.length) * 100) / 100,
      "2.5+": Math.round((total25 / overallStats.length) * 100) / 100,
      "3.5+": Math.round((total35 / overallStats.length) * 100) / 100,
      "4.5+": Math.round((total45 / overallStats.length) * 100) / 100,
    };
  };

  const goalStatsData: GoalStatsData = {
    homeStats,
    awayStats,
    overallStats,
    leagueAverage: calculateLeagueAverage(),
    homeLeagueAverages,
    awayLeagueAverages,
    overallLeagueAverages,
  };

  console.log('Final goal stats data:', { 
    isLoading, 
    error: error?.message, 
    homeCount: homeStats.length,
    awayCount: awayStats.length,
    overallCount: overallStats.length,
    homeLeagueAveragesCount: homeLeagueAverages.length,
    awayLeagueAveragesCount: awayLeagueAverages.length
  });

  return { goalStatsData, isLoading, error };
};
