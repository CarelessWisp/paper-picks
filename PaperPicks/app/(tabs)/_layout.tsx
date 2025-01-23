import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<
    typeof FontAwesome6
  >['name'];
  color: string;
  size?: number;
}) {
  return (
    <FontAwesome6
      size={25}
      style={{ marginBottom: -1 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 70,
          borderWidth: 2,
          borderRadius: 60,
        },
        tabBarActiveTintColor:
          Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(
          false,
          true,
        ),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="house-chimney"
              color={color}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome6
                    name="circle-info"
                    size={22}
                    color={
                      Colors[
                        colorScheme ?? 'light'
                      ].text
                    }
                    style={{
                      marginRight: 15,
                      opacity: pressed ? 0.5 : 1,
                    }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="betting"
        options={{
          title: 'Betting',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="coins"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="ranking-star"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              size={23}
              name="clock-rotate-left"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              size={25}
              name="user-circle"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
