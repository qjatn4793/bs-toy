package com.example.demo.room.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.room.entity.Reservation;
import com.example.demo.room.entity.Room;
import com.example.demo.room.service.ReservationService;
import com.example.demo.room.service.RoomService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/rooms")
@AllArgsConstructor
@Slf4j
public class RoomController {
	
    private RoomService roomService;
	
	private ReservationService reservationService;

    @GetMapping
    public List<Room> getRooms() {
        return roomService.getAllRooms();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable("id") Long id) {
        log.info("ID {}번 방을 조회합니다.", id);
        Room room = roomService.getRoomById(id);
        if (room != null) {
            log.info("ID {}번 방을 찾았습니다: {}", id, room);
            return ResponseEntity.ok(room);
        } else {
            log.warn("ID {}번 방을 찾을 수 없습니다.", id);
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/reserve")
    public ResponseEntity<String> reserveRoom(@PathVariable("id") Long id, @RequestBody Reservation reservation) {
        log.info("ID {}번 방을 예약합니다.", id);
        log.info("예약 정보: {}", reservation);
        
        String reserved = reservationService.reserveRoom(id, reservation);
        
        log.info("ID {}, {}", id, reserved);
        return ResponseEntity.ok(reserved);
    }
    
    @GetMapping("/{id}/available-dates")
    public ResponseEntity<List<LocalDate>> getAvailableDates(@PathVariable("id") Long id) {
        log.info("Fetching available dates for room id: {}", id);
        List<LocalDate> availableDates = reservationService.getAvailableDates(id);
        return ResponseEntity.ok(availableDates);
    }
}