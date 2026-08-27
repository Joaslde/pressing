<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTimeSlotRequest;
use App\Http\Requests\Admin\UpdateTimeSlotRequest;
use App\Http\Resources\TimeSlotResource;
use App\Models\TimeSlot;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TimeSlotController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return TimeSlotResource::collection(TimeSlot::orderBy('start_time')->get());
    }

    public function store(StoreTimeSlotRequest $request): TimeSlotResource
    {
        return new TimeSlotResource(TimeSlot::create($request->validated()));
    }

    public function update(UpdateTimeSlotRequest $request, TimeSlot $timeSlot): TimeSlotResource
    {
        $timeSlot->update($request->validated());

        return new TimeSlotResource($timeSlot);
    }

    public function destroy(TimeSlot $timeSlot): \Illuminate\Http\Response
    {
        $timeSlot->update(['is_active' => false]);

        return response()->noContent();
    }
}
