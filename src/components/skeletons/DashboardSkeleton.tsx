import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from '../ui/Skeleton';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';

const DashboardSkeleton: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = createStyles(tokens);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={150} height={24} style={{ marginBottom: 8 }} />
        <Skeleton width={100} height={14} />
      </View>

      {/* Hero */}
      <Skeleton
        width="100%"
        height={160}
        borderRadius={24}
        style={{ marginBottom: 20 }}
      />

      {/* Credit Row */}
      <View style={styles.row}>
        <Skeleton width="48%" height={80} borderRadius={20} />
        <Skeleton width="48%" height={80} borderRadius={20} />
      </View>

      {/* Quick Actions Title */}
      <Skeleton width={120} height={20} style={{ marginVertical: 20 }} />
      {/* Quick Actions Row */}
      <View style={styles.row}>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} width={70} height={70} borderRadius={16} />
        ))}
      </View>

      {/* Insights */}
      <Skeleton width={140} height={20} style={{ marginVertical: 20 }} />
      <View style={styles.row}>
        <Skeleton width="48%" height={100} borderRadius={16} />
        <Skeleton width="48%" height={100} borderRadius={16} />
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginTop: 10,
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
  });

export default DashboardSkeleton;
