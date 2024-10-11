package com.example.demo.room.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.room.entity.Room;
import com.example.demo.room.repository.RoomRepository;

import java.util.List;
import java.util.Optional;

@Service

public class RoomService {
	@Autowired
    private RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    public Room getRoomById(Long id) {
        Optional<Room> room = roomRepository.findById(id);
        return room.orElse(null);  // 방이 없으면 null 반환
    }
}
