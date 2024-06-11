import React from "react";
import {SafeAreaView } from "react-native";
import Feed from "../components/Feed";

export default function Home() {

  return (
    <SafeAreaView  style={{backgroundColor:'#101010'}}>
        <Feed/>
    </SafeAreaView>
  );
};