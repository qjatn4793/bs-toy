package com.example.demo.room.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.room.entity.Room;


public interface RoomRepository extends JpaRepository<Room, Long> {
}
