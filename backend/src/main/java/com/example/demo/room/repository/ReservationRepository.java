package com.example.demo.room.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.room.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	
	// 특정 방에 대한 모든 예약을 반환하는 메서드
    List<Reservation> findByRoomId(Long roomId);
}