<?xml version="1.0" encoding="UTF-8"?>
<tileset name="platformertiles" tilewidth="32" tileheight="32" tilecount="33" columns="11">
 <image source="tiles.png" trans="ff00ff" width="352" height="96"/>
 <tile id="1">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="3">
  <properties>
   <property name="action" value="reload"/>
   <property name="isDoor" type="bool" value="true"/>
   <property name="prompt" value="up"/>
  </properties>
 </tile>
 <tile id="12">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="14">
  <properties>
   <property name="index" type="int" value="101"/>
   <property name="isClimbable" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="19">
  <properties>
   <property name="isClimbable" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="23">
  <properties>
   <property name="collides" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="25">
  <properties>
   <property name="collides" type="bool" value="true"/>
   <property name="index" type="int" value="100"/>
  </properties>
 </tile>
</tileset>
