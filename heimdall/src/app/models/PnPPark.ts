import { ILocation } from "./ILocation";

export class PnPPark implements ILocation {
	public ParkID!: string;
	public GISID!: string;
	public WWFFID!: string;
	public POTAID!: string;
	public IOTAID!: string;
	public SANPCPAID!: string;
	public KRMNPAID!: string;
	public VKPID!: string;
	public ShireID!: string;
	public DataSet!: string;
	public createDate!: string;
	public IUCN!: string;
	public IBRA!: string | null;
	public Name!: string;
	public Alias!: string | null;
	public State!: string;
	public HASC!: string;
	public Type!: string;
	public Region!: string;
	public District!: string;
	public Management!: string;
	public Notes!: string;
	public HTTPLink!: string;
	public Longitude!: string;
	public Latitude!: string;
	public Area!: string;
	public DXCC!: string;
	public Status!: string;
	public Access!: string | null;
	public silos!: string[] | null;
	public ActivationCount!: string;
	public ActivationDate!: string;
	public ActivationCall!: string;
}
